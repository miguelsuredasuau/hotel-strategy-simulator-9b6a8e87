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
      const kpiRefs = formula.match(/kpi:[a-zA-Z0-9-]+/g) || [];

      kpiRefs.forEach((ref) => {
        const uuid = ref.replace('kpi:', '');
        const kpi = kpis.find((k) => k.uuid === uuid);
        if (kpi) {
          displayFormula = displayFormula.replace(
            ref,
            `[${kpi.name}]`
          );
        }
      });

      return displayFormula;
    } catch (error) {
      return formula; // Return original formula if parsing fails
    }
  };

  const parts = formatFormula(formula).split(/(\[[^\]]+\]|[-+*/()=<>!&|?:])/g).filter(Boolean);
  const hasInvalidParts = parts.some(part => part.includes('kpi:'));

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
        {parts.map((part, index) => {
          const isKPI = part.startsWith('[') && part.endsWith(']');
          const isOperator = /^[-+*/()=<>!&|?:]$/.test(part);
          
          if (isKPI) {
            const kpiName = part.slice(1, -1);
            return (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer group relative"
                onClick={() => onDelete?.(index)}
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
          
          if (isOperator) {
            return (
              <span
                key={index}
                className={cn(
                  "px-2 py-1 rounded cursor-pointer",
                  "font-mono text-sm group relative",
                  "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
                onClick={() => onDelete?.(index)}
              >
                {part}
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
              onClick={() => onDelete?.(index)}
            >
              {part.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};