import { Card } from "@/components/ui/card";
import { Calculator, GripHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      className="group bg-white hover:shadow-md transition-all duration-200"
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
                <Calculator className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">
                {kpi.default_value}
                {kpi.unit && <span className="text-sm ml-1 text-gray-500">{kpi.unit}</span>}
              </span>
              {kpi.default_value !== undefined && !isCalculated && (
                <span className="text-xs text-gray-400">
                  (Default: {kpi.default_value})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete action here
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KPICard;