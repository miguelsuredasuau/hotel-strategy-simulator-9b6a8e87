import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KPI } from "@/types/kpi";
import { Database } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  availableKPIs: KPI[];
}

export const FormulaInput = ({ value, onChange, availableKPIs }: FormulaInputProps) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const operators = [
    // Basic arithmetic
    { symbol: '+', label: 'Add' },
    { symbol: '-', label: 'Subtract' },
    { symbol: '*', label: 'Multiply' },
    { symbol: '/', label: 'Divide' },
    // Grouping
    { symbol: '(', label: 'Open Bracket' },
    { symbol: ')', label: 'Close Bracket' },
    // Comparison
    { symbol: '=', label: 'Equal' },
    { symbol: '!=', label: 'Not Equal' },
    { symbol: '>', label: 'Greater Than' },
    { symbol: '<', label: 'Less Than' },
    { symbol: '>=', label: 'Greater Equal' },
    { symbol: '<=', label: 'Less Equal' },
    // Logical
    { symbol: '&&', label: 'AND' },
    { symbol: '||', label: 'OR' },
    // Special
    { symbol: '?', label: 'If' },
    { symbol: ':', label: 'Else' },
  ];

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
    <div className="space-y-4">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
        placeholder="Build your formula (e.g., kpi:revenue - kpi:costs)"
        className="font-mono"
      />

      <div className="grid grid-cols-2 gap-4">
        {/* KPIs Section */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4" />
            <h3 className="font-medium">Variables</h3>
          </div>
          <ScrollArea className="h-48">
            <div className="grid grid-cols-1 gap-2">
              {availableKPIs.map((kpi) => (
                <Button
                  key={kpi.uuid}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto py-2"
                  onClick={() => handleKPIClick(kpi.name)}
                >
                  <div className="text-left">
                    <div className="font-medium">{kpi.name}</div>
                    {kpi.unit && (
                      <div className="text-xs text-muted-foreground">Unit: {kpi.unit}</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Operators Section */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Operators</h3>
          <ScrollArea className="h-48">
            <div className="grid grid-cols-3 gap-2">
              {operators.map((op) => (
                <Button
                  key={op.symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => handleOperatorClick(op.symbol)}
                  title={op.label}
                >
                  {op.symbol}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};