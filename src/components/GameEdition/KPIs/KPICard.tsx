import { Card } from "@/components/ui/card";
import { Calculator, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPI } from "@/types/kpi";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KPICardProps {
  kpi: KPI;
  gameId: string;
  calculatedValue?: number;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  onClick: () => void;
  onDelete: () => void;
  hasCircularDependency?: boolean;
}

const KPICard = ({ 
  kpi, 
  gameId,
  calculatedValue, 
  dragHandleProps, 
  onClick, 
  onDelete,
  hasCircularDependency 
}: KPICardProps) => {
  const isCalculated = Boolean(kpi.formula);
  
  const displayValue = isCalculated 
    ? (calculatedValue ?? 0) 
    : (kpi.default_value ?? 0);

  const formattedValue = kpi.is_percentage 
    ? `${displayValue}%`
    : Number(displayValue).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Card className="bg-white hover:shadow-md transition-all duration-200 transform-gpu">
      <div 
        className="p-3 cursor-grab active:cursor-grabbing touch-none"
        {...dragHandleProps}
      >
        <div className="flex items-center justify-between group">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {isCalculated && (
                <div className="flex items-center gap-1">
                  <Calculator className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  {hasCircularDependency && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Circular dependency detected in formula</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {kpi.name}
              </h3>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-semibold text-gray-900">
                {formattedValue}
              </span>
              {kpi.unit && !kpi.is_percentage && (
                <span className="text-xs text-gray-500">{kpi.unit}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Pencil className="h-3.5 w-3.5 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KPICard;