import { useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { useToast } from "@/components/ui/use-toast";

export const useKPICalculations = (kpis: KPI[] | undefined, gameId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const evaluateFormula = (formula: string, kpiValues: Record<string, number>): number => {
    try {
      // Replace KPI references with their values
      const evaluableFormula = formula.replace(/kpi:([a-zA-Z0-9_]+)/g, (_, kpiName) => {
        return kpiValues[kpiName]?.toString() || '0';
      });
      
      // Use Function constructor to safely evaluate the formula
      const result = new Function(`return ${evaluableFormula}`)();
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', error);
      return 0;
    }
  };

  const updateCalculatedKPIs = async () => {
    if (!kpis?.length) return;

    const kpiValues: Record<string, number> = {};
    const updates: { uuid: string; current_value: number }[] = [];
    const processedKPIs = new Set<string>();

    // First pass: get all non-calculated KPI values
    kpis.forEach(kpi => {
      if (!kpi.formula) {
        kpiValues[kpi.name] = kpi.current_value ?? kpi.default_value ?? 0;
      }
    });

    // Helper function to process a KPI and its dependencies
    const processKPI = (kpi: KPI) => {
      if (!kpi.formula || processedKPIs.has(kpi.uuid)) return;

      // Process dependencies first
      const dependencies = kpi.depends_on || [];
      dependencies.forEach(depName => {
        const depKPI = kpis.find(k => k.name === depName);
        if (depKPI && !processedKPIs.has(depKPI.uuid)) {
          processKPI(depKPI);
        }
      });

      const calculatedValue = evaluateFormula(kpi.formula, kpiValues);
      if (calculatedValue !== kpi.current_value) {
        updates.push({
          uuid: kpi.uuid,
          current_value: calculatedValue
        });
      }
      kpiValues[kpi.name] = calculatedValue;
      processedKPIs.add(kpi.uuid);
    };

    // Process all calculated KPIs
    kpis.forEach(kpi => {
      if (kpi.formula) {
        processKPI(kpi);
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
        
        queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
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
    }
  };

  // Run calculations whenever KPIs change
  useEffect(() => {
    updateCalculatedKPIs();
  }, [kpis]);

  return { updateCalculatedKPIs };
};