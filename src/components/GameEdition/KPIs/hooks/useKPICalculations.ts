import { useCallback } from 'react';
import { KPI } from "@/types/kpi";

export const useKPICalculations = (kpis: KPI[] | undefined, gameId: string) => {
  const evaluateFormula = (formula: string, kpiValues: Record<string, number>, processedKPIs: Set<string>): number => {
    try {
      // Replace KPI references with their actual values
      const evaluableFormula = formula.replace(/kpi:([a-zA-Z0-9-]+)/g, (match, kpiUuid) => {
        // Check for circular dependencies
        if (processedKPIs.has(kpiUuid)) {
          console.warn('Circular dependency detected:', kpiUuid);
          return '0';
        }

        const kpi = kpis?.find(k => k.uuid === kpiUuid);
        if (!kpi) {
          console.warn('KPI not found:', kpiUuid);
          return '0';
        }

        // If the KPI has a formula and hasn't been processed yet
        if (kpi.formula && !kpiValues[kpiUuid]) {
          processedKPIs.add(kpiUuid);
          const value = evaluateFormula(kpi.formula, kpiValues, processedKPIs);
          kpiValues[kpiUuid] = value;
          return value.toString();
        }

        // Return existing calculated value or default value
        const value = kpiValues[kpiUuid] ?? (typeof kpi.default_value === 'number' ? kpi.default_value : 0);
        return value.toString();
      });

      // Clean up and evaluate the formula
      const cleanFormula = evaluableFormula.trim();
      if (!cleanFormula) return 0;

      const result = new Function(`return ${cleanFormula}`)();
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', error, 'Formula:', formula);
      return 0;
    }
  };

  const calculateKPIValues = useCallback(() => {
    if (!kpis?.length) return {};

    const kpiValues: Record<string, number> = {};
    const processedKPIs = new Set<string>();

    // First pass: calculate non-formula KPIs
    kpis.forEach(kpi => {
      if (!kpi.formula) {
        kpiValues[kpi.uuid] = typeof kpi.default_value === 'number' ? kpi.default_value : 0;
      }
    });

    // Second pass: calculate formula KPIs
    kpis.forEach(kpi => {
      if (kpi.formula && !processedKPIs.has(kpi.uuid)) {
        kpiValues[kpi.uuid] = evaluateFormula(kpi.formula, kpiValues, new Set([kpi.uuid]));
      }
    });

    return kpiValues;
  }, [kpis]);

  return { calculateKPIValues };
};