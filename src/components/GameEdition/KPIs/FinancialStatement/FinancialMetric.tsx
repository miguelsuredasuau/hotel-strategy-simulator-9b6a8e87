import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface FinancialMetricProps {
  label: string;
  value?: string | number;
  isEditable?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const FinancialMetric = ({ 
  label, 
  value = 0, 
  isEditable = true,
  onChange,
  className = ""
}: FinancialMetricProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());

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
      </div>
    </div>
  );
};

export default FinancialMetric;