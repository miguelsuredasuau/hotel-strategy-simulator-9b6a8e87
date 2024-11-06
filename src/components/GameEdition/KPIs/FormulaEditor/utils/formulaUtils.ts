import { KPI } from "@/types/kpi";

interface Token {
  type: 'kpi' | 'operator' | 'number' | 'parenthesis';
  value: string;
  originalValue?: string;
}

export const tokenizeFormula = (formula: string, kpis: KPI[]): Token[] => {
  if (!formula) return [];

  // Add spaces around operators and parentheses if they're missing
  const spacedFormula = formula
    .replace(/([+\-*/()=<>!&|?:])/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = spacedFormula.split(' ');
  return tokens.map(token => {
    // Check if token is a KPI reference (now using ${uuid} format)
    if (token.match(/\${[a-zA-Z0-9-]+}/)) {
      const kpiId = token.replace(/\${(.*)}/, '$1');
      const kpi = kpis.find(k => k.uuid === kpiId);
      return {
        type: 'kpi',
        value: kpi ? `[${kpi.name}]` : '[Unknown KPI]',
        originalValue: token
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

  // Add spaces around operators and parentheses
  return updatedFormula
    .replace(/([+\-*/()=<>!&|?:])/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper function to convert between formats
export const convertKpiReference = {
  toDisplay: (uuid: string) => `\${${uuid}}`,
  fromDisplay: (reference: string) => reference.replace(/\${(.*)}/, '$1')
};