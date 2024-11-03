import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Settings2, Trash2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Turn } from "@/types/game";

interface TurnCardProps {
  turn: Turn;
  index: number;
  onEditOptions: (turn: Turn) => void;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
}

const TurnCard = ({ turn, index, onEditOptions, onEditTurn, onDeleteTurn }: TurnCardProps) => {
  return (
    <Draggable draggableId={`turn-${turn.uuid}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Turn {turn.turnnumber}</h3>
                  <p className="text-sm text-gray-500">{turn.challenge}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditOptions(turn)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
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