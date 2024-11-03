import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Database, Calculator } from "lucide-react";
import { KPI } from "@/types/kpi";

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  availableKPIs: KPI[];
}

export const FormulaInput = ({ value, onChange, availableKPIs }: FormulaInputProps) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [formattedValue, setFormattedValue] = useState("");
  
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

  useEffect(() => {
    // Format the formula with syntax highlighting
    const formatted = value
      .split(/(\bkpi:[a-zA-Z0-9_]+\b|[-+*/()=<>!&|?:])/g)
      .map((part, index) => {
        if (part.startsWith('kpi:')) {
          return `<span class="text-blue-500 font-medium">${part}</span>`;
        } else if (['+', '-', '*', '/', '(', ')', '=', '!=', '>', '<', '>=', '<=', '&&', '||', '?', ':'].includes(part)) {
          return `<span class="text-purple-500 font-medium">${part}</span>`;
        }
        return part;
      })
      .join('');
    
    setFormattedValue(formatted);
  }, [value]);

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
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Formula Editor</h3>
        </div>
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
            placeholder="Build your formula (e.g., kpi:revenue - kpi:costs)"
            className="font-mono bg-white/50 backdrop-blur-sm"
          />
          <div 
            className="absolute inset-0 pointer-events-none font-mono px-3 py-2 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: formattedValue }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white/50 backdrop-blur-sm">
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
                  className="justify-start h-auto py-2 hover:bg-blue-50"
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

        <Card className="p-4 bg-white/50 backdrop-blur-sm">
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
                  className="hover:bg-purple-50"
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