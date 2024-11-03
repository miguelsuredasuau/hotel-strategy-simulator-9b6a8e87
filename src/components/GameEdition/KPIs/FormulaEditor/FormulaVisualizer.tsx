import { KPI } from "@/types/kpi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface FormulaVisualizerProps {
  formula: string;
  kpis: KPI[];
  onDelete?: (index: number) => void;
}

export const FormulaVisualizer = ({ formula, kpis, onDelete }: FormulaVisualizerProps) => {
  const formatFormula = (formula: string) => {
    try {
      let displayFormula = formula;
      // Match complete kpi:uuid patterns to avoid splitting UUIDs
      const kpiRefs = formula.match(/kpi:[a-fA-F0-9-]{36}/g) || [];

      kpiRefs.forEach((ref) => {
        const uuid = ref.replace('kpi:', '');
        const kpi = kpis.find((k) => k.uuid === uuid);
        if (kpi) {
          // Add UUID to display name to differentiate between KPIs with same name
          const displayName = kpis.filter(k => k.name === kpi.name).length > 1 
            ? `${kpi.name} (${kpi.uuid.slice(0, 4)})`
            : kpi.name;
          
          displayFormula = displayFormula.replace(
            ref,
            `[${displayName}]`
          );
        }
      });

      return displayFormula;
    } catch (error) {
      return formula;
    }
  };

  // Split formula into tokens while preserving KPI references and operators
  const tokenizeFormula = (formula: string) => {
    const tokens: { type: 'kpi' | 'operator' | 'text'; value: string; originalValue?: string }[] = [];
    let currentToken = '';
    let insideKPI = false;
    
    const formattedFormula = formatFormula(formula);
    
    for (let i = 0; i < formattedFormula.length; i++) {
      const char = formattedFormula[i];
      
      if (char === '[') {
        if (currentToken) {
          tokens.push({ type: 'text', value: currentToken });
          currentToken = '';
        }
        insideKPI = true;
        currentToken = char;
      } else if (char === ']' && insideKPI) {
        currentToken += char;
        // Find the original KPI reference
        const kpiName = currentToken.slice(1, -1);
        const kpi = kpis.find(k => {
          const displayName = kpis.filter(k2 => k2.name === k.name).length > 1 
            ? `${k.name} (${k.uuid.slice(0, 4)})`
            : k.name;
          return displayName === kpiName;
        });
        tokens.push({ 
          type: 'kpi', 
          value: currentToken,
          originalValue: kpi ? `kpi:${kpi.uuid}` : undefined
        });
        currentToken = '';
        insideKPI = false;
      } else if (insideKPI) {
        currentToken += char;
      } else if (/[-+*/()=<>!&|?:]/.test(char)) {
        if (currentToken) {
          tokens.push({ type: 'text', value: currentToken });
          currentToken = '';
        }
        tokens.push({ type: 'operator', value: char });
      } else {
        currentToken += char;
      }
    }
    
    if (currentToken) {
      tokens.push({ type: 'text', value: currentToken });
    }
    
    return tokens;
  };

  const handleDelete = (index: number, token: { type: string; value: string; originalValue?: string }) => {
    if (!onDelete) return;
    
    // If it's a KPI token, we need to find its position in the original formula
    if (token.type === 'kpi' && token.originalValue) {
      const tokens = tokenizeFormula(formula);
      let originalFormulaIndex = 0;
      let count = 0;
      
      for (let i = 0; i < tokens.length; i++) {
        if (i === index) {
          onDelete(originalFormulaIndex);
          break;
        }
        if (tokens[i].type === 'kpi') {
          originalFormulaIndex += tokens[i].originalValue?.length || 0;
        } else {
          originalFormulaIndex += tokens[i].value.length;
        }
        count++;
      }
    } else {
      onDelete(index);
    }
  };

  const tokens = tokenizeFormula(formula);
  const hasInvalidParts = formula.includes('kpi:') && !formula.match(/kpi:[a-fA-F0-9-]{36}/g);

  if (hasInvalidParts) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>Invalid formula format. Please check your KPI references.</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="flex flex-wrap gap-2 items-center">
        {tokens.map((token, index) => {
          if (token.type === 'kpi') {
            const kpiName = token.value.slice(1, -1);
            return (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer group relative"
                onClick={() => handleDelete(index, token)}
              >
                {kpiName}
                {onDelete && (
                  <span className="absolute inset-0 flex items-center justify-center bg-blue-100/0 opacity-0 group-hover:opacity-100 transition-opacity">
                    ×
                  </span>
                )}
              </Badge>
            );
          }
          
          if (token.type === 'operator') {
            return (
              <span
                key={index}
                className={cn(
                  "px-2 py-1 rounded cursor-pointer",
                  "font-mono text-sm group relative",
                  "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => handleDelete(index, token)}
              >
                {token.value}
                {onDelete && (
                  <span className="absolute inset-0 flex items-center justify-center bg-gray-200/0 opacity-0 group-hover:opacity-100 transition-opacity">
                    ×
                  </span>
                )}
              </span>
            );
          }
          
          return (
            <span 
              key={index} 
              className="text-gray-600 cursor-pointer hover:text-gray-900"
              onClick={() => handleDelete(index, token)}
            >
              {token.value.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};