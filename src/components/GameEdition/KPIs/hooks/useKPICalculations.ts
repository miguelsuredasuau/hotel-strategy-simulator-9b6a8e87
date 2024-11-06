import { useCallback } from 'react';
import { KPI } from "@/types/kpi";

export const useKPICalculations = (kpis: KPI[] | undefined, gameId: string, executeImmediately: boolean = false) => {
  const evaluateFormula = (formula: string, kpiValues: Record<string, number>, processedKPIs: Set<string>): number => {
    try {
      console.log('Evaluating formula:', formula);
      console.log('Current KPI values:', kpiValues);
      console.log('Processed KPIs:', Array.from(processedKPIs));

      // Replace KPI references with their actual values
      const evaluableFormula = formula.replace(/kpi:([a-zA-Z0-9-]+)/g, (match, kpiUuid) => {
        console.log('Processing KPI reference:', kpiUuid);

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
          console.log(`Calculated value for ${kpi.name}:`, value);
          return value.toString();
        }

        // For non-calculated KPIs, use default_value
        const value = kpi.default_value ?? 0;
        kpiValues[kpiUuid] = value;
        console.log(`Default value for ${kpi.name}:`, value);
        return value.toString();
      });

      console.log('Formula after KPI replacement:', evaluableFormula);

      // Clean up the formula and evaluate it
      const cleanFormula = evaluableFormula.trim();
      if (!cleanFormula) return 0;

      // Use Function constructor to safely evaluate the formula
      const result = new Function(`return ${cleanFormula}`)();
      console.log('Evaluated result:', result);
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', error, 'Formula:', formula);
      return 0;
    }
  };

  const calculateKPIValues = useCallback(() => {
    if (!kpis?.length) return {};

    console.log('Starting KPI calculations for kpis:', kpis);
    const kpiValues: Record<string, number> = {};
    const processedKPIs = new Set<string>();

    // First pass: get all non-calculated KPI values
    kpis.forEach(kpi => {
      if (!kpi.formula) {
        kpiValues[kpi.uuid] = kpi.default_value ?? 0;
        console.log(`Setting default value for ${kpi.name}:`, kpiValues[kpi.uuid]);
      }
    });

    // Second pass: calculate values for KPIs with formulas
    kpis.forEach(kpi => {
      if (kpi.formula && !processedKPIs.has(kpi.uuid)) {
        console.log(`Calculating value for ${kpi.name} with formula:`, kpi.formula);
        const calculatedValue = evaluateFormula(kpi.formula, kpiValues, new Set([kpi.uuid]));
        kpiValues[kpi.uuid] = calculatedValue;
        processedKPIs.add(kpi.uuid);
        console.log(`Final calculated value for ${kpi.name}:`, calculatedValue);
      }
    });

    console.log('Final KPI values:', kpiValues);
    return kpiValues;
  }, [kpis]);

  return { calculateKPIValues };
};