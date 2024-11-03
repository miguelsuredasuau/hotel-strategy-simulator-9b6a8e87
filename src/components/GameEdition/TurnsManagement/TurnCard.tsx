import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Settings2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Turn } from "@/types/game";

interface TurnCardProps {
  turn: Turn;
  index: number;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
  onEditOptions: (turn: Turn) => void;
}

const TurnCard = ({ turn, index, onEditTurn, onDeleteTurn, onEditOptions }: TurnCardProps) => {
  return (
    <Draggable draggableId={`turn-${turn.uuid}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group"
        >
          <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {turn.turnnumber}
                  </div>
                  <div>
                    <h3 className="font-semibold">{turn.challenge || 'No challenge set'}</h3>
                    {turn.description && (
                      <p className="text-sm text-gray-500">{turn.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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