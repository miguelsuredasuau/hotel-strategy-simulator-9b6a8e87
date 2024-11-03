import { Card } from "@/components/ui/card";
import { Calculator, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPI } from "@/types/kpi";

interface KPICardProps {
  kpi: KPI;
  dragHandleProps: any;
  onClick: () => void;
  onDelete: () => void;
}

const KPICard = ({ kpi, dragHandleProps, onClick, onDelete }: KPICardProps) => {
  const isCalculated = !!kpi.formula;
  const displayValue = kpi.current_value ?? kpi.default_value ?? 0;

  return (
    <div className="relative transform-none">
      <Card 
        {...dragHandleProps}
        className="bg-white hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isCalculated && (
                  <Calculator className="h-4 w-4 text-blue-500 shrink-0" />
                )}
                <h3 className="font-medium text-gray-900">{kpi.name}</h3>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900">
                  {displayValue.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })}
                  {kpi.unit && <span className="text-sm ml-1 text-gray-500">{kpi.unit}</span>}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KPICard;