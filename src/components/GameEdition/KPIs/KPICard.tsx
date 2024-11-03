import { Card } from "@/components/ui/card";
import { GripHorizontal } from "lucide-react";
import { KPI } from "@/types/kpi";

interface KPICardProps {
  kpi: KPI;
  dragHandleProps: any;
  onClick: () => void;
}

const KPICard = ({ kpi, dragHandleProps, onClick }: KPICardProps) => {
  return (
    <Card className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div
                {...dragHandleProps}
                className="cursor-grab hover:text-blue-500 transition-colors"
              >
                <GripHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-lg text-gray-900">{kpi.name}</h4>
                {kpi.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {kpi.description}
                  </p>
                )}
              </div>
            </div>
            {kpi.formula && (
              <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md font-mono">
                {kpi.formula}
              </div>
            )}
            <div className="mt-4 flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">
                {kpi.current_value}
                {kpi.unit && (
                  <span className="text-base ml-1 text-gray-600">{kpi.unit}</span>
                )}
              </div>
              {kpi.default_value !== undefined && (
                <div className="text-sm text-gray-500">
                  Default: {kpi.default_value}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="p-2 border-t bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors text-center text-sm text-gray-600"
        onClick={onClick}
      >
        Click to edit
      </div>
    </Card>
  );
};

export default KPICard;