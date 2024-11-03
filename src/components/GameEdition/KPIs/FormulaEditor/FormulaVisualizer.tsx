import { KPI } from "@/types/kpi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface FormulaVisualizerProps {
  formula: string;
  kpis: KPI[];
  onDelete?: (index: number) => void;
  onChange?: (formula: string) => void;
}

export const FormulaVisualizer = ({ formula, kpis, onDelete, onChange }: FormulaVisualizerProps) => {
  const formatFormula = (formula: string) => {
    try {
      let displayFormula = formula;
      const kpiRefs = formula.match(/kpi:[a-fA-F0-9-]{36}/g) || [];

      kpiRefs.forEach((ref) => {
        const uuid = ref.replace('kpi:', '');
        const kpi = kpis.find((k) => k.uuid === uuid);
        if (kpi) {
          const displayName = kpis.filter(k => k.name === kpi.name).length > 1 
            ? `${kpi.name} (${kpi.uuid.slice(0, 4)})`
            : kpi.name;
          
          displayFormula = displayFormula.replace(
            ref,
            `[${displayName}]`
          );
        }
      });

      return displayFormula;
    } catch (error) {
      return formula;
    }
  };

  const tokenizeFormula = (formula: string) => {
    const tokens: { type: 'kpi' | 'operator' | 'text'; value: string; originalValue?: string }[] = [];
    const kpiPattern = /kpi:[a-fA-F0-9-]{36}/g;
    let lastIndex = 0;
    let match;

    while ((match = kpiPattern.exec(formula)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = formula.slice(lastIndex, match.index);
        const parts = textBefore.split(/([+\-*/()=<>!&|?:])/);
        parts.forEach(part => {
          if (part) {
            if (/^[+\-*/()=<>!&|?:]$/.test(part)) {
              tokens.push({ type: 'operator', value: part });
            } else {
              tokens.push({ type: 'text', value: part.trim() });
            }
          }
        });
      }

      const kpiRef = match[0];
      const uuid = kpiRef.replace('kpi:', '');
      const kpi = kpis.find(k => k.uuid === uuid);
      if (kpi) {
        const displayName = kpis.filter(k => k.name === kpi.name).length > 1 
          ? `${kpi.name} (${kpi.uuid.slice(0, 4)})`
          : kpi.name;
        tokens.push({ 
          type: 'kpi', 
          value: `[${displayName}]`,
          originalValue: kpiRef
        });
      }

      lastIndex = match.index + kpiRef.length;
    }

    if (lastIndex < formula.length) {
      const remainingText = formula.slice(lastIndex);
      const parts = remainingText.split(/([+\-*/()=<>!&|?:])/);
      parts.forEach(part => {
        if (part) {
          if (/^[+\-*/()=<>!&|?:]$/.test(part)) {
            tokens.push({ type: 'operator', value: part });
          } else {
            tokens.push({ type: 'text', value: part.trim() });
          }
        }
      });
    }

    return tokens;
  };

  const handleDelete = (index: number, token: { type: string; value: string; originalValue?: string }) => {
    if (!onDelete) return;
    
    const tokens = tokenizeFormula(formula);
    let position = 0;
    
    for (let i = 0; i < tokens.length; i++) {
      if (i === index) {
        onDelete(position);
        break;
      }
      if (tokens[i].type === 'kpi') {
        position += tokens[i].originalValue?.length || tokens[i].value.length;
      } else {
        position += tokens[i].value.length;
      }
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !onChange) return;

    const tokens = tokenizeFormula(formula);
    const reorderedTokens = Array.from(tokens);
    const [removed] = reorderedTokens.splice(result.source.index, 1);
    reorderedTokens.splice(result.destination.index, 0, removed);

    let newFormula = '';
    reorderedTokens.forEach(token => {
      if (token.type === 'kpi') {
        newFormula += token.originalValue;
      } else {
        newFormula += token.value;
      }
    });

    onChange(newFormula);
  };

  const tokens = tokenizeFormula(formula);
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
                    if (token.type === 'kpi') {
                      const kpiName = token.value.slice(1, -1);
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-grab active:cursor-grabbing group relative"
                            onClick={() => handleDelete(index, token)}
                          >
                            {kpiName}
                            {onDelete && (
                              <span className="absolute inset-0 flex items-center justify-center bg-blue-100/0 opacity-0 group-hover:opacity-100 transition-opacity">
                                ×
                              </span>
                            )}
                          </Badge>
                        </div>
                      );
                    }
                    
                    if (token.type === 'operator') {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span
                            className={cn(
                              "px-2 py-1 rounded cursor-grab active:cursor-grabbing",
                              "font-mono text-sm group relative",
                              "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                            onClick={() => handleDelete(index, token)}
                          >
                            {token.value}
                            {onDelete && (
                              <span className="absolute inset-0 flex items-center justify-center bg-gray-200/0 opacity-0 group-hover:opacity-100 transition-opacity">
                                ×
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    }
                    
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span 
                          className="text-gray-600 cursor-grab active:cursor-grabbing hover:text-gray-900"
                          onClick={() => handleDelete(index, token)}
                        >
                          {token.value.trim()}
                        </span>
                      </div>
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
