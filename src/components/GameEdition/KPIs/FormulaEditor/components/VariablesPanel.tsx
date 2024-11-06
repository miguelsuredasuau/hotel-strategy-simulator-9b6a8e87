import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { KPI } from "@/types/kpi";
import { NumberInput } from "./NumberInput";

interface VariablesPanelProps {
  numberInput: string;
  onNumberInputChange: (value: string) => void;
  onNumberInsert: () => void;
  filteredKPIs: KPI[];
  onKPIClick: (kpi: KPI) => void;
}

export const VariablesPanel = ({
  numberInput,
  onNumberInputChange,
  onNumberInsert,
  filteredKPIs,
  onKPIClick,
}: VariablesPanelProps) => {
  return (
    <Card className="col-span-2 p-4 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-4 w-4" />
        <h3 className="font-medium">Variables</h3>
      </div>
      <NumberInput
        value={numberInput}
        onChange={onNumberInputChange}
        onInsert={onNumberInsert}
      />
      <ScrollArea className="h-[120px]">
        <div className="grid grid-cols-2 gap-2">
          {filteredKPIs.map((kpi) => (
            <Button
              key={kpi.uuid}
              variant="outline"
              size="sm"
              className="justify-start h-auto py-1.5 px-2 hover:bg-blue-50 group"
              onClick={() => onKPIClick(kpi)}
            >
              <span className="font-medium group-hover:text-blue-700 truncate">
                {kpi.name}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};