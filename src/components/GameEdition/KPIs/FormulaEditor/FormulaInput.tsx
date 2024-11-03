import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Database, Calculator, Eye, EyeOff } from "lucide-react";
import { KPI } from "@/types/kpi";
import { FormulaVisualizer } from "./FormulaVisualizer";

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  availableKPIs: KPI[];
  gameId: string;
  currentKpiId?: string;
}

export const FormulaInput = ({ 
  value, 
  onChange, 
  availableKPIs, 
  gameId,
  currentKpiId 
}: FormulaInputProps) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showRawFormula, setShowRawFormula] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Filter out the current KPI from the available KPIs
  const filteredKPIs = availableKPIs.filter(kpi => kpi.uuid !== currentKpiId);

  const operators = [
    { symbol: '+', label: 'Add' },
    { symbol: '-', label: 'Subtract' },
    { symbol: '*', label: 'Multiply' },
    { symbol: '/', label: 'Divide' },
    { symbol: '(', label: 'Open' },
    { symbol: ')', label: 'Close' },
    { symbol: '=', label: 'Equal' },
    { symbol: '!=', label: 'Not Equal' },
    { symbol: '>', label: 'Greater' },
    { symbol: '<', label: 'Less' },
    { symbol: '>=', label: 'Greater Eq' },
    { symbol: '<=', label: 'Less Eq' },
    { symbol: '&&', label: 'AND' },
    { symbol: '||', label: 'OR' },
    { symbol: '?', label: 'If' },
    { symbol: ':', label: 'Else' },
  ];

  const insertAtCursor = (textToInsert: string) => {
    const newValue = value.slice(0, cursorPosition) + textToInsert + value.slice(cursorPosition);
    onChange(newValue);
    const newPosition = cursorPosition + textToInsert.length;
    setCursorPosition(newPosition);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const handleKPIClick = (kpi: KPI) => {
    insertAtCursor(`kpi:${kpi.uuid}`);
  };

  const handleOperatorClick = (operator: string) => {
    insertAtCursor(operator);
  };

  const handleDeletePart = (index: number) => {
    const parts = value.split(/(\[[^\]]+\]|[-+*/()=<>!&|?:])/g).filter(Boolean);
    parts.splice(index, 1);
    onChange(parts.join('').trim());
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Formula Editor</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRawFormula(!showRawFormula)}
            className="gap-2"
          >
            {showRawFormula ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Raw Formula
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Raw Formula
              </>
            )}
          </Button>
        </div>

        {showRawFormula ? (
          <div className="relative">
            <Input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
              placeholder="Build your formula using KPI UUIDs (e.g., kpi:uuid1 - kpi:uuid2)"
              className="font-mono bg-white h-auto min-h-[2.5rem] py-2 text-sm whitespace-nowrap overflow-x-auto"
            />
          </div>
        ) : (
          <FormulaVisualizer 
            formula={value} 
            kpis={availableKPIs} 
            onDelete={handleDeletePart}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-4 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4" />
            <h3 className="font-medium">Variables</h3>
          </div>
          <ScrollArea className="h-[120px]">
            <div className="grid grid-cols-2 gap-2">
              {filteredKPIs.map((kpi) => (
                <Button
                  key={kpi.uuid}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto py-1.5 px-2 hover:bg-blue-50 group"
                  onClick={() => handleKPIClick(kpi)}
                >
                  <span className="font-medium group-hover:text-blue-700 truncate">
                    {kpi.name}
                  </span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-4 bg-white">
          <h3 className="font-medium mb-3">Operators</h3>
          <ScrollArea className="h-[120px]">
            <div className="grid grid-cols-4 gap-1.5">
              {operators.map((op) => (
                <Button
                  key={op.symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => handleOperatorClick(op.symbol)}
                  title={op.label}
                  className="hover:bg-blue-50 hover:text-blue-700 px-1 py-1 h-7 text-xs"
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