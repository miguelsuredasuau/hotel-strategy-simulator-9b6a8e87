import { useEffect, useCallback } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { useToast } from "@/components/ui/use-toast";

export const useKPICalculations = (kpis: KPI[] | undefined, gameId: string, executeImmediately: boolean = false) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const evaluateFormula = (formula: string, kpiValues: Record<string, number>, processedKPIs: Set<string>): number => {
    try {
      // Replace KPI UUID references with their values
      const evaluableFormula = formula.replace(/kpi:([a-zA-Z0-9-]+)/g, (_, kpiUuid) => {
        if (processedKPIs.has(kpiUuid)) {
          return kpiValues[kpiUuid]?.toString() || '0';
        }
        
        const kpi = kpis?.find(k => k.uuid === kpiUuid);
        if (!kpi) return '0';
        
        if (kpi.formula) {
          processedKPIs.add(kpiUuid);
          const value = evaluateFormula(kpi.formula, kpiValues, processedKPIs);
          kpiValues[kpiUuid] = value;
          return value.toString();
        }
        
        return (kpiValues[kpiUuid] ?? 0).toString();
      });
      
      // Use Function constructor to safely evaluate the formula
      const result = new Function(`return ${evaluableFormula}`)();
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', error);
      return 0;
    }
  };

  const updateCalculatedKPIs = useCallback(async () => {
    if (!kpis?.length) return;

    console.log('Updating calculated KPIs...');

    const kpiValues: Record<string, number> = {};
    const updates: { uuid: string; current_value: number }[] = [];
    const processedKPIs = new Set<string>();

    // First pass: get all non-calculated KPI values
    kpis.forEach(kpi => {
      if (!kpi.formula) {
        kpiValues[kpi.uuid] = kpi.current_value ?? kpi.default_value ?? 0;
      }
    });

    // Process KPIs in dependency order
    const processKPI = (kpi: KPI, visited: Set<string>) => {
      if (visited.has(kpi.uuid)) return;
      visited.add(kpi.uuid);

      // Process dependencies first
      const dependencies = kpi.depends_on || [];
      dependencies.forEach(depUuid => {
        const depKPI = kpis.find(k => k.uuid === depUuid);
        if (depKPI) {
          processKPI(depKPI, visited);
        }
      });

      if (kpi.formula) {
        const calculatedValue = evaluateFormula(kpi.formula, kpiValues, new Set());
        if (calculatedValue !== kpi.current_value) {
          updates.push({
            uuid: kpi.uuid,
            current_value: calculatedValue
          });
        }
        kpiValues[kpi.uuid] = calculatedValue;
      }
    };

    // Process all KPIs
    const visited = new Set<string>();
    kpis.forEach(kpi => {
      processKPI(kpi, visited);
    });

    // Update calculated KPIs in database
    if (updates.length > 0) {
      try {
        console.log('Updating KPIs in database:', updates);
        
        for (const update of updates) {
          const { error } = await supabase
            .from('kpis')
            .update({ current_value: update.current_value })
            .eq('uuid', update.uuid);

          if (error) throw error;
        }
        
        await queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
        toast({
          title: "Success",
          description: `Updated ${updates.length} calculated KPIs`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to update calculated KPIs",
          variant: "destructive",
        });
        console.error('Error updating KPIs:', error);
      }
    } else {
      console.log('No KPI updates needed');
    }
  }, [kpis, gameId, queryClient, toast]);

  // Run calculations on mount if executeImmediately is true
  useEffect(() => {
    if (executeImmediately) {
      updateCalculatedKPIs();
    }
  }, []); // Empty dependency array to only run on mount

  // Run calculations whenever KPIs change
  useEffect(() => {
    if (kpis) {
      updateCalculatedKPIs();
    }
  }, [kpis, updateCalculatedKPIs]);

  return { updateCalculatedKPIs };
};