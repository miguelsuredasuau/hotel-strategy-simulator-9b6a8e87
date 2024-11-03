import { KPI } from "@/types/kpi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FormulaVisualizerProps {
  formula: string;
  kpis: KPI[];
}

export const FormulaVisualizer = ({ formula, kpis }: FormulaVisualizerProps) => {
  const formatFormula = (formula: string) => {
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
  };

  const parts = formatFormula(formula).split(/(\[[^\]]+\]|[-+*/()=<>!&|?:])/g).filter(Boolean);

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
                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {kpiName}
              </Badge>
            );
          }
          
          if (isOperator) {
            return (
              <span
                key={index}
                className={cn(
                  "px-2 py-1 rounded",
                  "font-mono text-sm",
                  "bg-gray-100 text-gray-700"
                )}
              >
                {part}
              </span>
            );
          }
          
          return (
            <span key={index} className="text-gray-600">
              {part.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};