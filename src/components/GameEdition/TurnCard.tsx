import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, Pencil, Trash2 } from "lucide-react";
import { Turn } from "@/types/game";
import { useNavigate } from "react-router-dom";
import { Draggable } from "@hello-pangea/dnd";

interface TurnCardProps {
  turn: Turn;
  index: number;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
}

const TurnCard = ({ turn, index, onEditTurn, onDeleteTurn }: TurnCardProps) => {
  const navigate = useNavigate();

  return (
    <Draggable draggableId={`turn-${turn.uuid}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Turn {turn.turnnumber}
                  </h3>
                  <p className="text-gray-600 mb-4">{turn.description}</p>
                  <p className="text-sm font-medium">Challenge:</p>
                  <p className="text-gray-600">{turn.challenge}</p>
                </div>
                <div className="flex gap-2">
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
                    onClick={() => onDeleteTurn(turn)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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