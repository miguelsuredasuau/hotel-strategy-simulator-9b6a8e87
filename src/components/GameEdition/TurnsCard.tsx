import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TurnEditDialog from "./TurnEditDialog";
import OptionsEditDialog from "./OptionsEditDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { Turn } from "@/types/game";

interface TurnsCardProps {
  turns: Turn[];
}

const TurnsCard = ({ turns: initialTurns }: TurnsCardProps) => {
  const [turns, setTurns] = useState<Turn[]>(initialTurns);
  const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(turns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      turnnumber: index + 1,
    }));

    setTurns(updatedItems);
    toast({
      title: "Turn order updated",
      description: "The new turn order has been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Turns</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="turns">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {turns.map((turn, index) => (
                  <Draggable
                    key={turn.id}
                    draggableId={turn.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
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
                                onClick={() => {
                                  setSelectedTurn(turn);
                                  setIsEditOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedTurn(turn);
                                  setIsOptionsOpen(true);
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedTurn(turn);
                                  setIsDeleteOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {selectedTurn && (
          <>
            <TurnEditDialog
              turn={selectedTurn}
              open={isEditOpen}
              onOpenChange={setIsEditOpen}
              onSave={(updatedTurn) => {
                setTurns(turns.map(t => t.id === updatedTurn.id ? updatedTurn : t));
                setIsEditOpen(false);
                toast({
                  title: "Turn updated",
                  description: "The turn has been successfully updated.",
                });
              }}
            />
            <OptionsEditDialog
              turnId={selectedTurn.id}
              gameId={selectedTurn.game}
              open={isOptionsOpen}
              onOpenChange={setIsOptionsOpen}
            />
            <DeleteConfirmDialog
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              onConfirm={() => {
                setTurns(turns.filter(t => t.id !== selectedTurn.id));
                setIsDeleteOpen(false);
                toast({
                  title: "Turn deleted",
                  description: "The turn has been successfully deleted.",
                });
              }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TurnsCard;