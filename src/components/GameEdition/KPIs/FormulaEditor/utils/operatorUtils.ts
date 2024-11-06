export const operators = [
  { symbol: '+', label: 'Add' },
  { symbol: '-', label: 'Subtract' },
  { symbol: '*', label: 'Multiply' },
  { symbol: '/', label: 'Divide' },
  { symbol: '(', label: 'Open' },
  { symbol: ')', label: 'Close' },
  { symbol: '=', label: 'Equal' },
  { symbol: '!=', label: 'Not Equal' },
  { symbol: '>', label: 'Greater' },
  { symbol: '<', label: 'Less' },
  { symbol: '>=', label: 'Greater Eq' },
  { symbol: '<=', label: 'Less Eq' },
  { symbol: '&&', label: 'AND' },
  { symbol: '||', label: 'OR' },
  { symbol: '?', label: 'If' },
  { symbol: ':', label: 'Else' },
] as const;

export const formatFormula = (formula: string): string => {
  return formula
    .replace(/([+\-*/()=<>!&|?:])/g, ' $1 ') // Add spaces around operators
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
};

export const isOperator = (char: string): boolean => {
  return operators.some(op => op.symbol === char);
};