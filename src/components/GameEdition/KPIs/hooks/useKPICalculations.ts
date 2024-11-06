import { useCallback, useEffect } from 'react';
import { KPI } from "@/types/kpi";
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useKPICalculations = (gameId: string) => {
  const queryClient = useQueryClient();

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

  const evaluateFormula = useCallback((formula: string, kpiValues: Record<string, number>, kpis: KPI[], processedKPIs: Set<string>): number => {
    try {
      const evaluableFormula = formula.replace(/kpi:([a-zA-Z0-9-]+)/g, (match, kpiUuid) => {
        if (processedKPIs.has(kpiUuid)) {
          console.warn('Circular dependency detected:', kpiUuid);
          return '0';
        }

        const kpi = kpis.find(k => k.uuid === kpiUuid);
        if (!kpi) {
          console.warn('KPI not found:', kpiUuid);
          return '0';
        }

        if (kpi.formula && !kpiValues[kpiUuid]) {
          processedKPIs.add(kpiUuid);
          const value = evaluateFormula(kpi.formula, kpiValues, kpis, processedKPIs);
          kpiValues[kpiUuid] = value;
          return value.toString();
        }

        const value = kpiValues[kpiUuid] ?? (typeof kpi.default_value === 'number' ? kpi.default_value : 0);
        return value.toString();
      });

      const cleanFormula = evaluableFormula.trim();
      if (!cleanFormula) return 0;

      const result = new Function(`return ${cleanFormula}`)();
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', error, 'Formula:', formula);
      return 0;
    }
  }, []);

  const calculateKPIValues = useCallback((kpis: KPI[]) => {
    const kpiValues: Record<string, number> = {};
    
    // First pass: calculate non-formula KPIs
    kpis.forEach(kpi => {
      if (!kpi.formula) {
        kpiValues[kpi.uuid] = typeof kpi.default_value === 'number' ? kpi.default_value : 0;
      }
    });

    // Second pass: calculate formula KPIs
    kpis.forEach(kpi => {
      if (kpi.formula && !kpiValues[kpi.uuid]) {
        kpiValues[kpi.uuid] = evaluateFormula(kpi.formula, kpiValues, kpis, new Set([kpi.uuid]));
      }
    });

    return kpiValues;
  }, [evaluateFormula]);

  return { calculateKPIValues };
};