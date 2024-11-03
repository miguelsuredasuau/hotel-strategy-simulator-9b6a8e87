import { Button } from "@/components/ui/button";
import { KPI } from "@/types/kpi";

interface FinancialMetricProps {
  label: string;
  kpi?: KPI;
  value?: string | number;
  isEditable?: boolean;
  onEdit?: (kpi: KPI) => void;
  onDelete?: (kpi: KPI) => void;
  className?: string;
}

const FinancialMetric = ({ 
  label, 
  kpi, 
  value, 
  isEditable = true,
  onEdit,
  onDelete,
  className = ""
}: FinancialMetricProps) => {
  return (
    <div className={`flex justify-between items-center group ${className}`}>
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-4">
        <span className="font-medium">
          {value !== undefined ? value : kpi?.default_value || 0}
        </span>
        {isEditable && kpi && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(kpi)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete?.(kpi)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialMetric;