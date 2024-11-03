import { KPI } from "@/types/kpi";

interface Token {
  type: 'kpi' | 'operator' | 'text';
  value: string;
  originalValue?: string;
}

export const tokenizeFormula = (formula: string, kpis: KPI[]): Token[] => {
  const tokens: Token[] = [];
  const kpiPattern = /kpi:[a-fA-F0-9-]{36}/g;
  let lastIndex = 0;
  let match;

  while ((match = kpiPattern.exec(formula)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = formula.slice(lastIndex, match.index);
      const parts = textBefore.split(/([+\-*/()=<>!&|?:])/);
      parts.forEach(part => {
        if (part) {
          if (/^[+\-*/()=<>!&|?:]$/.test(part)) {
            tokens.push({ type: 'operator', value: part });
          } else {
            tokens.push({ type: 'text', value: part.trim() });
          }
        }
      });
    }

    const kpiRef = match[0];
    const uuid = kpiRef.replace('kpi:', '');
    const kpi = kpis.find(k => k.uuid === uuid);
    if (kpi) {
      const displayName = kpis.filter(k => k.name === kpi.name).length > 1 
        ? `${kpi.name} (${kpi.uuid.slice(0, 4)})`
        : kpi.name;
      tokens.push({ 
        type: 'kpi', 
        value: `[${displayName}]`,
        originalValue: kpiRef
      });
    }

    lastIndex = match.index + kpiRef.length;
  }

  if (lastIndex < formula.length) {
    const remainingText = formula.slice(lastIndex);
    const parts = remainingText.split(/([+\-*/()=<>!&|?:])/);
    parts.forEach(part => {
      if (part) {
        if (/^[+\-*/()=<>!&|?:]$/.test(part)) {
          tokens.push({ type: 'operator', value: part });
        } else {
          tokens.push({ type: 'text', value: part.trim() });
        }
      }
    });
  }

  return tokens;
};

export const calculateDeletePosition = (tokens: Token[], targetIndex: number): { start: number; end: number } => {
  let position = 0;
  let deleteStart = 0;
  
  for (let i = 0; i < tokens.length; i++) {
    if (i === targetIndex) {
      deleteStart = position;
      const token = tokens[i];
      const length = token.type === 'kpi' ? token.originalValue?.length || token.value.length : token.value.length;
      return { start: deleteStart, end: deleteStart + length };
    }
    
    const token = tokens[i];
    if (token.type === 'kpi' && token.originalValue) {
      position += token.originalValue.length;
    } else {
      position += token.value.length;
    }
  }
  
  return { start: 0, end: 0 };
};