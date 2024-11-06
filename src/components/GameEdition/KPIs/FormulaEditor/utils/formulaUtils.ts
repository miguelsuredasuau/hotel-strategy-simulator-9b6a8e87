import { KPI } from "@/types/kpi";

interface Token {
  type: 'kpi' | 'operator' | 'number' | 'parenthesis';
  value: string;
  originalValue?: string;
}

export const tokenizeFormula = (formula: string, kpis: KPI[]): Token[] => {
  if (!formula) return [];

  // First, temporarily replace KPI references to protect them from splitting
  const kpiPlaceholders: { [key: string]: string } = {};
  let protectedFormula = formula.replace(/\${[^}]+}/g, (match) => {
    const placeholder = `__KPI_${Object.keys(kpiPlaceholders).length}__`;
    kpiPlaceholders[placeholder] = match;
    return placeholder;
  });

  // Add spaces around operators and parentheses if they're missing
  protectedFormula = protectedFormula
    .replace(/([+\-*/()=<>!&|?:])/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into tokens
  const tokens = protectedFormula.split(' ').filter(Boolean);

  // Process tokens and restore KPI references
  return tokens.map(token => {
    // Restore KPI reference if this is a placeholder
    if (token.startsWith('__KPI_') && token.endsWith('__')) {
      const originalKpiRef = kpiPlaceholders[token];
      const kpiId = originalKpiRef.replace(/\${(.*)}/, '$1');
      const kpi = kpis.find(k => k.uuid === kpiId);
      return {
        type: 'kpi',
        value: kpi ? `[${kpi.name}]` : '[Unknown KPI]',
        originalValue: originalKpiRef
      };
    }

    // Check if token is an operator
    if (['+', '-', '*', '/', '(', ')', '=', '!=', '>', '<', '>=', '<=', '&&', '||', '?', ':'].includes(token)) {
      return {
        type: 'operator',
        value: token
      };
    }

    // Check if token is a number
    if (!isNaN(Number(token))) {
      return {
        type: 'number',
        value: token
      };
    }

    return {
      type: 'number',
      value: token
    };
  });
};

export const calculateDeletePosition = (tokens: Token[], index: number) => {
  let position = 0;
  for (let i = 0; i < index; i++) {
    const token = tokens[i];
    if (token.type === 'kpi') {
      position += token.originalValue?.length || token.value.length;
    } else {
      position += token.value.length;
    }
    if (i < tokens.length - 1) position += 1;
  }

  const currentToken = tokens[index];
  const length = currentToken.type === 'kpi' 
    ? currentToken.originalValue?.length || currentToken.value.length 
    : currentToken.value.length;

  return {
    start: position,
    end: position + length
  };
};

export const formatFormula = (formula: string): string => {
  if (!formula) return '';

  // Convert old kpi:uuid format to new ${uuid} format if needed
  const updatedFormula = formula.replace(/kpi:([a-zA-Z0-9-]+)/g, '${$1}');

  // Temporarily protect KPI references
  const kpiPlaceholders: { [key: string]: string } = {};
  let protectedFormula = updatedFormula.replace(/\${[^}]+}/g, (match) => {
    const placeholder = `__KPI_${Object.keys(kpiPlaceholders).length}__`;
    kpiPlaceholders[placeholder] = match;
    return placeholder;
  });

  // Add spaces around operators and parentheses
  protectedFormula = protectedFormula
    .replace(/([+\-*/()=<>!&|?:])/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();

  // Restore KPI references
  Object.entries(kpiPlaceholders).forEach(([placeholder, original]) => {
    protectedFormula = protectedFormula.replace(placeholder, original);
  });

  return protectedFormula;
};

// Helper function to convert between formats
export const convertKpiReference = {
  toDisplay: (uuid: string) => `\${${uuid}}`,
  fromDisplay: (reference: string) => reference.replace(/\${(.*)}/, '$1')
};