import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPI } from "@/types/kpi";
import { useState } from "react";

interface FinancialMetricProps {
  label: string;
  kpi?: KPI;
  value?: string | number;
  isEditable?: boolean;
  onEdit?: (kpi: KPI) => void;
  onDelete?: (kpi: KPI) => void;
  onChange?: (value: number) => void;
  className?: string;
}

const FinancialMetric = ({ 
  label, 
  kpi, 
  value, 
  isEditable = true,
  onEdit,
  onDelete,
  onChange,
  className = ""
}: FinancialMetricProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(newValue) && onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex justify-between items-center py-0.5 group ${className}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Input
            type="text"
            value={value?.toString()}
            onChange={handleChange}
            onBlur={() => setIsEditing(false)}
            className="w-32 text-right"
            autoFocus
          />
        ) : (
          <span 
            className={`font-medium text-right w-32 ${isEditable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onClick={() => isEditable && setIsEditing(true)}
          >
            {formatNumber(Number(value || 0))}
          </span>
        )}
        {isEditable && kpi && onEdit && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(kpi)}
              className="h-6 px-2 text-xs"
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