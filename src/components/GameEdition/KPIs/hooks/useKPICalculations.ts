import { useCallback } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";

export const useKPICalculations = (kpis: KPI[] | undefined, gameId: string, executeImmediately: boolean = false) => {
  const queryClient = useQueryClient();

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
        
        // For non-calculated KPIs, use current_value if available, otherwise use default_value
        const value = kpi.current_value ?? kpi.default_value ?? 0;
        kpiValues[kpiUuid] = value;
        return value.toString();
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
        updates.push({
          uuid: kpi.uuid,
          current_value: calculatedValue
        });
        kpiValues[kpi.uuid] = calculatedValue;
      }
    };

    // Process all KPIs
    const visited = new Set<string>();
    kpis.forEach(kpi => {
      if (kpi.formula) {
        processKPI(kpi, visited);
      }
    });

    // Update calculated KPIs in database
    if (updates.length > 0) {
      try {
        for (const update of updates) {
          const { error } = await supabase
            .from('kpis')
            .update({ current_value: update.current_value })
            .eq('uuid', update.uuid);

          if (error) throw error;
        }
        
        await queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      } catch (error: any) {
        console.error('Error updating KPIs:', error);
        throw error;
      }
    }
  }, [kpis, gameId, queryClient]);

  return { updateCalculatedKPIs };
};