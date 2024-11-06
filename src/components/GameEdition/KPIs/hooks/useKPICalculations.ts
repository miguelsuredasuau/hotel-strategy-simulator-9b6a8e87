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

  const findCircularDependencies = useCallback((
    kpiUuid: string,
    kpis: KPI[],
    visited: Set<string> = new Set(),
    path: string[] = []
  ): string[] | null => {
    if (visited.has(kpiUuid)) {
      const cycleStart = path.indexOf(kpiUuid);
      const cycle = path.slice(cycleStart);
      cycle.push(kpiUuid);
      return cycle;
    }

    visited.add(kpiUuid);
    path.push(kpiUuid);

    const kpi = kpis.find(k => k.uuid === kpiUuid);
    if (!kpi?.formula) {
      path.pop();
      return null;
    }

    const dependencies = kpi.formula.match(/\${([^}]+)}/g)?.map(match => match.replace(/\${(.+)}/, '$1')) || [];

    for (const depUuid of dependencies) {
      const cycle = findCircularDependencies(depUuid, kpis, visited, path);
      if (cycle) {
        return cycle;
      }
    }

    path.pop();
    return null;
  }, []);

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
      const updatedFormula = formula.replace(/kpi:([a-zA-Z0-9-]+)/g, '${$1}');

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

      console.debug('Evaluating formula:', evaluableFormula);

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
    
    // Check for circular dependencies first
    for (const kpi of kpis) {
      if (kpi.formula) {
        const cycle = findCircularDependencies(kpi.uuid, kpis);
        if (cycle) {
          const kpiNames = cycle.map(uuid => kpis.find(k => k.uuid === uuid)?.name || uuid);
          return { values: kpiValues, error: `Found circular dependency in KPIs: ${kpiNames.join(' → ')}` };
        }
      }
    }

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

    return { values: kpiValues, error: null };
  }, [evaluateFormula, findCircularDependencies]);

  return { calculateKPIValues };
};