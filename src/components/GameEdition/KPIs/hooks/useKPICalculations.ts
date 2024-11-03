import { useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";

export const useKPICalculations = (kpis: KPI[] | undefined, gameId: string) => {
  const queryClient = useQueryClient();

  const evaluateFormula = (formula: string, kpiValues: Record<string, number>): number => {
    try {
      // Replace KPI references with their values
      const evaluableFormula = formula.replace(/kpi:([a-zA-Z0-9_]+)/g, (_, kpiName) => {
        return kpiValues[kpiName]?.toString() || '0';
      });
      
      // Use Function constructor to safely evaluate the formula
      const result = new Function(`return ${evaluableFormula}`)();
      return typeof result === 'number' ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', error);
      return 0;
    }
  };

  useEffect(() => {
    const updateCalculatedKPIs = async () => {
      if (!kpis) return;

      const kpiValues: Record<string, number> = {};
      const updates: { uuid: string; current_value: number }[] = [];

      // First pass: get all non-calculated KPI values
      kpis.forEach(kpi => {
        if (!kpi.formula) {
          kpiValues[kpi.name] = kpi.current_value ?? kpi.default_value ?? 0;
        }
      });

      // Second pass: calculate formulas
      kpis.forEach(kpi => {
        if (kpi.formula) {
          const calculatedValue = evaluateFormula(kpi.formula, kpiValues);
          if (calculatedValue !== kpi.current_value) {
            updates.push({
              uuid: kpi.uuid,
              current_value: calculatedValue
            });
          }
          kpiValues[kpi.name] = calculatedValue;
        }
      });

      // Update calculated KPIs in database
      if (updates.length > 0) {
        for (const update of updates) {
          await supabase
            .from('kpis')
            .update({ current_value: update.current_value })
            .eq('uuid', update.uuid);
        }
        queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      }
    };

    updateCalculatedKPIs();
  }, [kpis, gameId, queryClient]);
};