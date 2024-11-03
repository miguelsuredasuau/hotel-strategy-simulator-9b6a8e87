import { Card } from "@/components/ui/card";
import { GripHorizontal, Calculator } from "lucide-react";
import { KPI } from "@/types/kpi";

interface KPICardProps {
  kpi: KPI;
  dragHandleProps: any;
  onClick: () => void;
}

const KPICard = ({ kpi, dragHandleProps, onClick }: KPICardProps) => {
  const isCalculated = !!kpi.formula;

  return (
    <Card 
      className="group bg-white/80 hover:bg-white transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div
            {...dragHandleProps}
            className="cursor-grab hover:text-blue-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <GripHorizontal className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{kpi.name}</h3>
              {isCalculated && (
                <Calculator className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">
                {kpi.current_value}
                {kpi.unit && <span className="text-sm ml-1 text-gray-500">{kpi.unit}</span>}
              </span>
              {kpi.default_value !== undefined && !isCalculated && (
                <span className="text-xs text-gray-400">
                  (Default: {kpi.default_value})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KPICard;