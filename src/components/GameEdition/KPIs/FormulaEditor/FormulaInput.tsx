import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Eye, EyeOff } from "lucide-react";
import { KPI } from "@/types/kpi";
import { FormulaVisualizer } from "./FormulaVisualizer";
import { formatFormula } from "./utils/operatorUtils";
import { VariablesPanel } from "./components/VariablesPanel";
import { OperatorsPanel } from "./components/OperatorsPanel";

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
  currentKpiId,
}: FormulaInputProps) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showRawFormula, setShowRawFormula] = useState(false);
  const [numberInput, setNumberInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredKPIs = availableKPIs.filter(kpi => kpi.uuid !== currentKpiId);

  const insertAtCursor = (textToInsert: string) => {
    const position = cursorPosition || value.length;
    const newValue = formatFormula(
      value.slice(0, position) + textToInsert + value.slice(position)
    );
    onChange(newValue);
    const newPosition = position + textToInsert.length;
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
    insertAtCursor(` ${operator} `);
  };

  const handleNumberInsert = () => {
    if (numberInput) {
      const numericValue = Number(numberInput);
      if (!isNaN(numericValue)) {
        insertAtCursor(numericValue.toString());
        setNumberInput("");
      }
    }
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
              onChange={(e) => {
                onChange(formatFormula(e.target.value));
                setCursorPosition(e.target.selectionStart || 0);
              }}
              onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
              placeholder="Build your formula using KPI UUIDs (e.g., kpi:uuid1 - kpi:uuid2)"
              className="font-mono bg-white h-auto min-h-[2.5rem] py-2 text-sm whitespace-nowrap overflow-x-auto"
            />
          </div>
        ) : (
          <FormulaVisualizer
            formula={value}
            kpis={availableKPIs}
            onChange={onChange}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <VariablesPanel
          numberInput={numberInput}
          onNumberInputChange={setNumberInput}
          onNumberInsert={handleNumberInsert}
          filteredKPIs={filteredKPIs}
          onKPIClick={handleKPIClick}
        />
        <OperatorsPanel onOperatorClick={handleOperatorClick} />
      </div>
    </div>
  );
};