import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ScrollText, ChevronDown, ChevronRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import TurnCard from './TurnCard';
import TurnEditDialog from '../TurnEditDialog';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { Turn } from '@/types/game';

interface TurnsSectionProps {
  gameId: string;
}

const TurnsSection = ({ gameId }: TurnsSectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Only query if gameId is a valid UUID
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(gameId);

  const { data: turns, isLoading } = useQuery({
    queryKey: ['turns', gameId],
    queryFn: async () => {
      if (!isValidUUID) {
        throw new Error('Invalid game ID');
      }

      const { data, error } = await supabase
        .from('Turns')
        .select('*')
        .eq('game_uuid', gameId)
        .order('turnnumber');

      if (error) throw error;
      return data as Turn[];
    },
    enabled: isValidUUID // Only run query if gameId is valid
  });

  const handleDeleteTurn = async (turnUuid: string) => {
    try {
      // First delete all options associated with this turn
      const { error: optionsError } = await supabase
        .from('Options')
        .delete()
        .eq('turn_uuid', turnUuid);

      if (optionsError) throw optionsError;

      // Then delete the turn
      const { error: turnError } = await supabase
        .from('Turns')
        .delete()
        .eq('uuid', turnUuid);

      if (turnError) throw turnError;

      queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
      toast({
        title: "Success",
        description: "Turn deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !turns) return;

    const items = Array.from(turns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update turn numbers
    const updatedTurns = items.map((turn, index) => ({
      ...turn,
      turnnumber: index + 1
    }));

    try {
      for (const turn of updatedTurns) {
        const { error } = await supabase
          .from('Turns')
          .update({ turnnumber: turn.turnnumber })
          .eq('uuid', turn.uuid);
        
        if (error) throw error;
      }

      queryClient.setQueryData(['turns', gameId], updatedTurns);
      toast({
        title: "Success",
        description: "Turn order updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isValidUUID) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Invalid Game ID</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Unable to load turns: Invalid game ID provided.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger className="hover:opacity-75">
              {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </CollapsibleTrigger>
            <ScrollText className="h-5 w-5" />
            <CardTitle>Turns Management</CardTitle>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Turn
          </Button>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="turns">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {isLoading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-20 bg-gray-100 rounded-lg" />
                        ))}
                      </div>
                    ) : turns?.length ? (
                      turns.map((turn, index) => (
                        <TurnCard
                          key={turn.uuid}
                          turn={turn}
                          index={index}
                          onEditTurn={(turn) => {
                            setSelectedTurn(turn);
                            setIsEditDialogOpen(true);
                          }}
                          onDeleteTurn={(turn) => {
                            setSelectedTurn(turn);
                            setIsDeleteDialogOpen(true);
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No turns created yet
                      </p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <TurnEditDialog
        turn={selectedTurn || { uuid: '', turnnumber: turns ? turns.length + 1 : 1, game_uuid: gameId }}
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedTurn(null);
          }
        }}
        onSave={async (updatedTurn) => {
          try {
            if (isCreateDialogOpen) {
              const { error } = await supabase
                .from('Turns')
                .insert([{
                  ...updatedTurn,
                  game_uuid: gameId,
                  turnnumber: turns ? turns.length + 1 : 1
                }]);
              
              if (error) throw error;
              
              toast({
                title: "Success",
                description: "Turn created successfully",
              });
            } else {
              const { error } = await supabase
                .from('Turns')
                .update(updatedTurn)
                .eq('uuid', updatedTurn.uuid);
              
              if (error) throw error;
              
              toast({
                title: "Success",
                description: "Turn updated successfully",
              });
            }
            
            queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedTurn(null);
          } catch (error: any) {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
        }}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => selectedTurn && handleDeleteTurn(selectedTurn.uuid)}
      />
    </Card>
  );
};

export default TurnsSection;
