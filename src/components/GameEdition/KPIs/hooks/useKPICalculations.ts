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
      // Replace KPI references with their values
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

        // If this KPI has a formula, evaluate it first
        if (kpi.formula) {
          processedKPIs.add(kpiUuid);
          const value = evaluateFormula(kpi.formula, kpiValues, kpis, processedKPIs);
          processedKPIs.delete(kpiUuid); // Remove from processed set after evaluation
          kpiValues[kpiUuid] = value;
          return `(${value})`;  // Wrap in parentheses to maintain operator precedence
        }

        // Use existing value or default value
        const value = kpiValues[kpiUuid] ?? kpi.default_value ?? 0;
        return `(${value})`; // Wrap in parentheses to maintain operator precedence
      });

      // Clean up the formula and handle arithmetic operations
      const cleanFormula = evaluableFormula
        .replace(/-/g, ' - ')  // Add spaces around minus signs
        .replace(/\+/g, ' + ') // Add spaces around plus signs
        .replace(/\s+/g, ' ')  // Normalize spaces
        .trim();

      if (!cleanFormula) return 0;

      // Evaluate the formula in a safe context
      const result = new Function(`return ${cleanFormula}`)();
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', error, 'Formula:', formula);
      return 0;
    }
  }, []);

  const calculateKPIValues = useCallback((kpis: KPI[]) => {
    const kpiValues: Record<string, number> = {};
    
    // First pass: initialize non-formula KPIs
    kpis.forEach(kpi => {
      if (!kpi.formula) {
        kpiValues[kpi.uuid] = kpi.default_value ?? 0;
      }
    });

    // Second pass: calculate formula KPIs
    kpis.forEach(kpi => {
      if (kpi.formula) {
        const processedKPIs = new Set<string>();
        kpiValues[kpi.uuid] = evaluateFormula(kpi.formula, kpiValues, kpis, processedKPIs);
      }
    });

    return kpiValues;
  }, [evaluateFormula]);

  return { calculateKPIValues };
};