import { useCallback } from 'react';
import { KPI } from "@/types/kpi";

export const useKPICalculations = (kpis: KPI[] | undefined, gameId: string, executeImmediately: boolean = false) => {
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

        // If it's a calculated KPI, evaluate its formula
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

      // Clean up the formula and evaluate it
      const cleanFormula = evaluableFormula.trim();
      if (!cleanFormula) return 0;

      // Use Function constructor to safely evaluate the formula
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

    // First pass: get all non-calculated KPI values
    kpis.forEach(kpi => {
      if (!kpi.formula) {
        kpiValues[kpi.uuid] = kpi.default_value ?? 0;
      }
    });

    // Second pass: calculate values for KPIs with formulas
    kpis.forEach(kpi => {
      if (kpi.formula && !processedKPIs.has(kpi.uuid)) {
        const calculatedValue = evaluateFormula(kpi.formula, kpiValues, new Set([kpi.uuid]));
        kpiValues[kpi.uuid] = calculatedValue;
        processedKPIs.add(kpi.uuid);
      }
    });

    return kpiValues;
  }, [kpis]);

  return { calculateKPIValues };
};