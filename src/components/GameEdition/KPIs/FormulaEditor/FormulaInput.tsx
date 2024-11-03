import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Database, Calculator, Plus } from "lucide-react";
import { KPI } from "@/types/kpi";
import { KPICreateDialog } from "../KPICreateDialog";

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
  availableKPIs: KPI[];
  gameId: string;
}

export const FormulaInput = ({ value, onChange, availableKPIs, gameId }: FormulaInputProps) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const operators = [
    { symbol: '+', label: 'Add' },
    { symbol: '-', label: 'Subtract' },
    { symbol: '*', label: 'Multiply' },
    { symbol: '/', label: 'Divide' },
    { symbol: '(', label: 'Open Bracket' },
    { symbol: ')', label: 'Close Bracket' },
    { symbol: '=', label: 'Equal' },
    { symbol: '!=', label: 'Not Equal' },
    { symbol: '>', label: 'Greater Than' },
    { symbol: '<', label: 'Less Than' },
    { symbol: '>=', label: 'Greater Equal' },
    { symbol: '<=', label: 'Less Equal' },
    { symbol: '&&', label: 'AND' },
    { symbol: '||', label: 'OR' },
    { symbol: '?', label: 'If' },
    { symbol: ':', label: 'Else' },
  ];

  const handleKPIClick = (kpiName: string) => {
    const newValue = value.slice(0, cursorPosition) + `kpi:${kpiName}` + value.slice(cursorPosition);
    onChange(newValue);
  };

  const handleOperatorClick = (operator: string) => {
    const newValue = value.slice(0, cursorPosition) + operator + value.slice(cursorPosition);
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
            className="font-mono bg-white h-auto min-h-[2.5rem] py-2 text-sm whitespace-nowrap overflow-x-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <h3 className="font-medium">Variables</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> New KPI
            </Button>
          </div>
          <ScrollArea className="h-[280px]">
            <div className="grid grid-cols-3 gap-2">
              {availableKPIs.map((kpi) => (
                <Button
                  key={kpi.uuid}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto py-1.5 px-2 hover:bg-blue-50 group text-left"
                  onClick={() => handleKPIClick(kpi.name)}
                >
                  <div>
                    <div className="font-medium group-hover:text-blue-700 truncate text-xs">{kpi.name}</div>
                    {kpi.unit && (
                      <div className="text-[10px] text-muted-foreground truncate">{kpi.unit}</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-4 bg-white">
          <h3 className="font-medium mb-3">Operators</h3>
          <ScrollArea className="h-[280px]">
            <div className="grid grid-cols-2 gap-2">
              {operators.map((op) => (
                <Button
                  key={op.symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => handleOperatorClick(op.symbol)}
                  title={op.label}
                  className="hover:bg-blue-50 hover:text-blue-700 px-2 py-1.5 h-8 text-xs"
                >
                  {op.symbol}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <KPICreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        gameId={gameId}
      />
    </div>
  );
};