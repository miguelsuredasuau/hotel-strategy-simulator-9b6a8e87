import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { operators } from "../utils/operatorUtils";

interface OperatorsPanelProps {
  onOperatorClick: (operator: string) => void;
}

export const OperatorsPanel = ({ onOperatorClick }: OperatorsPanelProps) => {
  return (
    <Card className="p-4 bg-white">
      <h3 className="font-medium mb-3">Operators</h3>
      <ScrollArea className="h-[120px]">
        <div className="grid grid-cols-4 gap-1.5">
          {operators.map((op) => (
            <Button
              key={op.symbol}
              variant="outline"
              size="sm"
              onClick={() => onOperatorClick(op.symbol)}
              title={op.label}
              className="hover:bg-blue-50 hover:text-blue-700 px-1 py-1 h-7 text-xs"
            >
              {op.symbol}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};