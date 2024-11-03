import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KPI } from "@/types/kpi";

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  availableKPIs: KPI[];
}

export const FormulaInput = ({ value, onChange, availableKPIs }: FormulaInputProps) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const operators = ['+', '-', '*', '/', '(', ')'];

  const handleKPIClick = (kpiName: string) => {
    const before = value.slice(0, cursorPosition);
    const after = value.slice(cursorPosition);
    const newValue = `${before}kpi:${kpiName}${after}`;
    onChange(newValue);
  };

  const handleOperatorClick = (operator: string) => {
    const before = value.slice(0, cursorPosition);
    const after = value.slice(cursorPosition);
    const newValue = `${before}${operator}${after}`;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {operators.map((operator) => (
          <Button
            key={operator}
            variant="outline"
            size="sm"
            onClick={() => handleOperatorClick(operator)}
          >
            {operator}
          </Button>
        ))}
      </div>
      
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
        placeholder="Build your formula (e.g., kpi:revenue - kpi:costs)"
        className="font-mono"
      />

      <ScrollArea className="h-32 rounded-md border">
        <div className="p-4 grid grid-cols-2 gap-2">
          {availableKPIs.map((kpi) => (
            <Button
              key={kpi.uuid}
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => handleKPIClick(kpi.name)}
            >
              {kpi.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};