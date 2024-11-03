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
    <div className={`flex justify-between items-center py-1.5 group ${className}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-4">
        <span className={`font-medium ${isEditable ? 'bg-gray-50 px-3 py-1 rounded shadow-sm' : ''}`}>
          {value !== undefined ? value : kpi?.default_value || 0}
        </span>
        {isEditable && kpi && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(kpi)}
              className="h-7 px-2 text-xs"
            >
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialMetric;