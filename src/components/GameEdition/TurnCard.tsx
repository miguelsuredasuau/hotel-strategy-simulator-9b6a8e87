import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Copy, Trash2 } from "lucide-react";
import { Turn } from "@/types/game";
import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

interface TurnCardProps {
  turn: Turn;
  index: number;
  onEditOptions: (turn: Turn) => void;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
}

const TurnCard = ({ turn, index, onEditOptions, onEditTurn, onDeleteTurn }: TurnCardProps) => {
  const navigate = useNavigate();

  return (
    <Draggable draggableId={`turn-${turn.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative inline-flex items-center justify-center w-8 h-8">
                    <div className="absolute inset-0 bg-hotel-primary rounded-full" />
                    <span className="relative text-sm font-semibold text-white">
                      {turn.turnnumber}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{turn.challenge}</h3>
                    <p className="text-sm text-gray-600">{turn.description}</p>
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
                    onClick={() => navigate(`/game-edition/${turn.game}/turn/${turn.id}/options`)}
                  >
                    <Copy className="h-4 w-4" />
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