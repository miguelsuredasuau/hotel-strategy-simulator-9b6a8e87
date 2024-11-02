import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Turn } from "@/types/game";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TurnCard from "./TurnCard";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import OptionsPage from "./Options/OptionsPage";

interface TurnsCardProps {
  turns: Turn[];
  onEditOptions: (turn: Turn) => void;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
  onAddTurn: () => void;
}

const TurnsCard = ({ turns, onEditOptions, onEditTurn, onDeleteTurn, onAddTurn }: TurnsCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null);
  const [showOptionsPage, setShowOptionsPage] = useState(false);

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !turns) return;

    const items = Array.from(turns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update turn numbers for all affected turns
    const updatedTurns = items.map((turn, index) => ({
      ...turn,
      turnnumber: index + 1
    }));

    // Update all turns in the database
    try {
      for (const turn of updatedTurns) {
        const { error } = await supabase
          .from('Turns')
          .update({ turnnumber: turn.turnnumber })
          .eq('id', turn.id);
        
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['turns'] });
      toast({
        title: "Success",
        description: "Turn order updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating turn order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (showOptionsPage && selectedTurn) {
    return (
      <OptionsPage
        turnId={selectedTurn.id}
        gameId={selectedTurn.game}
        onBack={() => {
          setShowOptionsPage(false);
          setSelectedTurn(null);
        }}
      />
    );
  }

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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="turns">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {turns.map((turn, index) => (
                  <TurnCard
                    key={turn.id}
                    turn={turn}
                    index={index}
                    onEditOptions={() => {
                      setSelectedTurn(turn);
                      setShowOptionsPage(true);
                    }}
                    onEditTurn={onEditTurn}
                    onDeleteTurn={onDeleteTurn}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default TurnsCard;
