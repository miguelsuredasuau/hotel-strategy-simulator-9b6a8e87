import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface FinancialMetricProps {
  label: string;
  kpi?: {
    uuid: string;
    name: string;
  };
  value?: string | number;
  isEditable?: boolean;
  onEdit?: (kpi: any) => void;
  onDelete?: (kpi: any) => void;
  onChange?: (value: number) => void;
  className?: string;
}

const FinancialMetric = ({ 
  label, 
  kpi, 
  value = 0, 
  isEditable = true,
  onEdit,
  onDelete,
  onChange,
  className = ""
}: FinancialMetricProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/,/g, '');
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    const numericValue = parseFloat(localValue.replace(/,/g, ''));
    if (!isNaN(numericValue) && onChange) {
      onChange(numericValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalValue(value.toString());
    }
  };

  return (
    <div className={`flex justify-between items-center py-0.5 group ${className}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Input
            type="text"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-32 text-right"
            autoFocus
          />
        ) : (
          <span 
            className={`font-medium text-right w-32 ${isEditable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onClick={() => isEditable && setIsEditing(true)}
          >
            {formatNumber(Number(value))}
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