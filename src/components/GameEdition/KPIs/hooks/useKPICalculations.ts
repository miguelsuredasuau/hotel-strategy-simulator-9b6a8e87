import { useCallback, useEffect } from 'react';
import { KPI } from "@/types/kpi";
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export const useKPICalculations = (gameId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel('kpis-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'kpis',
          filter: `game_uuid=eq.${gameId}`
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [gameId, queryClient]);

  const findCircularDependencies = (
    kpiUuid: string,
    kpis: KPI[],
    visited: Set<string> = new Set(),
    path: string[] = []
  ): string[] | null => {
    if (visited.has(kpiUuid)) {
      const cycleStart = path.indexOf(kpiUuid);
      const cycle = path.slice(cycleStart);
      cycle.push(kpiUuid); // Complete the cycle
      return cycle;
    }

    visited.add(kpiUuid);
    path.push(kpiUuid);

    const kpi = kpis.find(k => k.uuid === kpiUuid);
    if (!kpi?.formula) {
      path.pop();
      return null;
    }

    // Extract KPI references from formula
    const dependencies = kpi.formula.match(/\${([^}]+)}/g)?.map(match => match.replace(/\${(.+)}/, '$1')) || [];

    for (const depUuid of dependencies) {
      const cycle = findCircularDependencies(depUuid, kpis, visited, path);
      if (cycle) {
        return cycle;
      }
    }

    path.pop();
    return null;
  };

  const evaluateFormula = useCallback((
    formula: string, 
    kpiValues: Record<string, number>, 
    kpis: KPI[], 
    processedKPIs: Set<string>,
    depth: number = 0
  ): number => {
    if (depth > 100) {
      console.error('Maximum recursion depth reached, possible circular dependency');
      return 0;
    }

    try {
      // Convert old kpi:uuid format to new ${uuid} format if needed
      const updatedFormula = formula.replace(/kpi:([a-zA-Z0-9-]+)/g, '${$1}');

      // Replace KPI references with their values
      const evaluableFormula = updatedFormula.replace(/\${([^}]+)}/g, (match, kpiUuid) => {
        if (processedKPIs.has(kpiUuid)) {
          return kpiValues[kpiUuid]?.toString() || '0';
        }

        const kpi = kpis.find(k => k.uuid === kpiUuid);
        if (!kpi) {
          console.warn('KPI not found:', kpiUuid);
          return '0';
        }

        if (kpi.formula) {
          processedKPIs.add(kpiUuid);
          const value = evaluateFormula(kpi.formula, kpiValues, kpis, processedKPIs, depth + 1);
          processedKPIs.delete(kpiUuid);
          kpiValues[kpiUuid] = value;
          return `(${value})`;
        }

        const value = kpiValues[kpiUuid] ?? kpi.default_value ?? 0;
        return `(${value})`;
      });

      // Log the formula for debugging
      console.debug('Evaluating formula:', evaluableFormula);

      // Evaluate the formula in a safe context
      const result = new Function(`return ${evaluableFormula}`)();
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', error, 'Formula:', formula);
      return 0;
    }
  }, []);

  const calculateKPIValues = useCallback((kpis: KPI[]) => {
    const kpiValues: Record<string, number> = {};
    const calculatedKPIs = new Set<string>();
    
    // First check for circular dependencies
    for (const kpi of kpis) {
      if (kpi.formula) {
        const cycle = findCircularDependencies(kpi.uuid, kpis);
        if (cycle) {
          const kpiNames = cycle.map(uuid => kpis.find(k => k.uuid === uuid)?.name || uuid);
          toast({
            title: "Circular Dependency Detected",
            description: `Found circular dependency in KPIs: ${kpiNames.join(' → ')}`,
            variant: "destructive",
          });
          return kpiValues;
        }
      }
    }

    // Calculate values for non-circular KPIs
    const calculateSingleKPI = (kpi: KPI): number => {
      if (calculatedKPIs.has(kpi.uuid)) {
        return kpiValues[kpi.uuid];
      }

      if (kpi.formula) {
        const processedKPIs = new Set<string>();
        const value = evaluateFormula(kpi.formula, kpiValues, kpis, processedKPIs);
        kpiValues[kpi.uuid] = value;
        calculatedKPIs.add(kpi.uuid);
        return value;
      }

      const value = kpi.default_value ?? 0;
      kpiValues[kpi.uuid] = value;
      calculatedKPIs.add(kpi.uuid);
      return value;
    };

    kpis.forEach(kpi => {
      calculateSingleKPI(kpi);
    });

    return kpiValues;
  }, [evaluateFormula, toast]);

  return { calculateKPIValues };
};