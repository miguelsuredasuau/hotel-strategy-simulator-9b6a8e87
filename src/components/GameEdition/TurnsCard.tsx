import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { Turn } from "@/types/game";

interface TurnsCardProps {
  turns: Turn[];
  onEditOptions: (turn: Turn) => void;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
  onAddTurn: () => void;
}

const TurnsCard = ({ turns, onEditOptions, onEditTurn, onDeleteTurn, onAddTurn }: TurnsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Game Turns</CardTitle>
        <Button onClick={onAddTurn}>
          <Plus className="h-4 w-4 mr-2" />
          Add Turn
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {turns.map((turn) => (
            <Card key={turn.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      Turn {turn.turnnumber}
                    </h3>
                    <p className="text-gray-600 font-medium mb-1">{turn.challenge}</p>
                    <p className="text-sm text-gray-500">
                      {turn.description}
                    </p>
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
                      onClick={() => onEditOptions(turn)}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TurnsCard;