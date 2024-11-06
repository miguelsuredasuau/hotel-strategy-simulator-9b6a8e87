import { useCallback } from 'react';
import { KPI } from "@/types/kpi";

export const useKPICalculations = (kpis: KPI[] | undefined, gameId: string, executeImmediately: boolean = false) => {
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
        
        // For non-calculated KPIs, use default_value
        const value = kpi.default_value ?? 0;
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

  const calculateKPIValues = useCallback(() => {
    if (!kpis?.length) return {};

    const kpiValues: Record<string, number> = {};
    const processedKPIs = new Set<string>();

    // First pass: get all non-calculated KPI values
    kpis.forEach(kpi => {
      if (!kpi.formula) {
        kpiValues[kpi.uuid] = kpi.default_value ?? 0;
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

    return kpiValues;
  }, [kpis]);

  return { calculateKPIValues };
};