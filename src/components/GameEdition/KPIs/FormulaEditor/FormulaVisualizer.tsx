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

  const tokenizeFormula = (formula: string) => {
    const tokens: { type: 'kpi' | 'operator' | 'text'; value: string; originalValue?: string }[] = [];
    const kpiPattern = /kpi:[a-fA-F0-9-]{36}/g;
    let lastIndex = 0;
    let match;

    // First, find all KPI references and their positions
    while ((match = kpiPattern.exec(formula)) !== null) {
      // Add any text before the KPI reference
      if (match.index > lastIndex) {
        const textBefore = formula.slice(lastIndex, match.index);
        // Split text into operators and other text
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

      // Add the KPI reference
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

    // Add any remaining text after the last KPI reference
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

  const handleDelete = (index: number, token: { type: string; value: string; originalValue?: string }) => {
    if (!onDelete) return;
    
    const tokens = tokenizeFormula(formula);
    let position = 0;
    
    for (let i = 0; i < tokens.length; i++) {
      if (i === index) {
        onDelete(position);
        break;
      }
      // Use the original KPI reference length for KPI tokens
      if (tokens[i].type === 'kpi') {
        position += tokens[i].originalValue?.length || tokens[i].value.length;
      } else {
        position += tokens[i].value.length;
      }
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