import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Turn } from "@/types/game";

interface TurnCardProps {
  turn: Turn;
  index: number;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
}

const TurnCard = ({ turn, index, onEditTurn, onDeleteTurn }: TurnCardProps) => {
  return (
    <Draggable draggableId={`turn-${turn.uuid}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div {...provided.dragHandleProps} className="cursor-grab">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Turn {turn.turnnumber}</h3>
                    <p className="text-sm text-gray-500">{turn.challenge || 'No challenge set'}</p>
                    {turn.description && (
                      <p className="text-xs text-gray-400 mt-1">{turn.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditTurn(turn)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteTurn(turn)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TurnCard;