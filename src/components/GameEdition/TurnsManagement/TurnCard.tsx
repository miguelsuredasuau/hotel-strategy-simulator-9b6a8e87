import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, Pencil, Trash2, GripVertical } from "lucide-react";
import { Turn } from "@/types/game";
import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

interface TurnCardProps {
  turn: Turn;
  index: number;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
}

const TurnCard = ({ turn, index, onEditTurn, onDeleteTurn }: TurnCardProps) => {
  const navigate = useNavigate();

  return (
    <Draggable draggableId={turn.uuid} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging
              ? provided.draggableProps.style?.transform
              : "none",
          }}
          className="mb-4"
        >
          <Card className={`transition-shadow duration-200 ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : 'hover:shadow-md'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    {...provided.dragHandleProps}
                    className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>
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
                    onClick={() => navigate(`/game-edition/${turn.game_uuid}/turn/${turn.uuid}/options`)}
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