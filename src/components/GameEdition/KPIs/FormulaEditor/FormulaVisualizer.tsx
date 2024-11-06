import { KPI } from "@/types/kpi";
import { AlertCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { KPIToken } from "./components/KPIToken";
import { OperatorToken } from "./components/OperatorToken";
import { TextToken } from "./components/TextToken";
import { tokenizeFormula, calculateDeletePosition } from "./utils/formulaUtils";

interface FormulaVisualizerProps {
  formula: string;
  kpis: KPI[];
  onDelete?: (index: number) => void;
  onChange?: (formula: string) => void;
}

export const FormulaVisualizer = ({ formula, kpis, onDelete, onChange }: FormulaVisualizerProps) => {
  const handleDelete = (index: number, token: { type: string; value: string; originalValue?: string }) => {
    if (!onDelete || !onChange) return;
    
    const tokens = tokenizeFormula(formula, kpis);
    const { start, end } = calculateDeletePosition(tokens, index);
    
    // Create new formula by removing the token and any extra spaces
    const newFormula = (formula.slice(0, start) + formula.slice(end))
      .replace(/\s+/g, ' ')
      .trim();
    
    onChange(newFormula);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !onChange) return;

    const tokens = tokenizeFormula(formula, kpis);
    const reorderedTokens = Array.from(tokens);
    const [removed] = reorderedTokens.splice(result.source.index, 1);
    reorderedTokens.splice(result.destination.index, 0, removed);

    let newFormula = reorderedTokens
      .map(token => {
        if (token.type === 'kpi') {
          return token.originalValue;
        }
        return token.value;
      })
      .join(' ')
      .trim();

    onChange(newFormula);
  };

  const tokens = tokenizeFormula(formula, kpis);
  const hasInvalidParts = formula.includes('kpi:') && !formula.match(/kpi:[a-fA-F0-9-]{36}/g);

  if (hasInvalidParts) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>Invalid formula format. Please check your KPI references.</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="formula" direction="horizontal">
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-wrap gap-2 items-center min-h-[2.5rem]"
            >
              {tokens.map((token, index) => (
                <Draggable 
                  key={`${index}-${token.value}`} 
                  draggableId={`${index}-${token.value}`} 
                  index={index}
                >
                  {(provided) => {
                    const commonProps = {
                      innerRef: provided.innerRef,
                      draggableProps: provided.draggableProps,
                      dragHandleProps: provided.dragHandleProps,
                      onDelete: () => handleDelete(index, token)
                    };

                    if (token.type === 'kpi') {
                      return (
                        <KPIToken
                          {...commonProps}
                          name={token.value.slice(1, -1)}
                        />
                      );
                    }
                    
                    if (token.type === 'operator') {
                      return (
                        <OperatorToken
                          {...commonProps}
                          value={token.value}
                        />
                      );
                    }
                    
                    return (
                      <TextToken
                        {...commonProps}
                        value={token.value}
                      />
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};