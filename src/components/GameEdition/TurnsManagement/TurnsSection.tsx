import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ScrollText, ChevronDown, ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import TurnCard from './TurnCard';
import TurnEditDialog from '../TurnEditDialog';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import OptionsEditDialog from '../OptionsEditDialog';
import { Turn } from '@/types/game';
import { useTurnsQuery } from './useTurnsQuery';
import { useTurnActions } from './useTurnActions';

interface TurnsSectionProps {
  gameId: string;
}

const TurnsSection = ({ gameId }: TurnsSectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isOptionsDialogOpen, setIsOptionsDialogOpen] = useState(false);
  const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const { turns, isLoading, isError } = useTurnsQuery(gameId);
  const { handleDeleteTurn, handleDragEnd } = useTurnActions(gameId);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSaveTurn = async (turn: Turn) => {
    try {
      if (isCreateDialogOpen) {
        const { error } = await supabase
          .from('Turns')
          .insert([{
            challenge: turn.challenge,
            description: turn.description,
            game_uuid: gameId,
            turnnumber: turns ? turns.length + 1 : 1,
            created_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Turns')
          .update({
            challenge: turn.challenge,
            description: turn.description,
            turnnumber: turn.turnnumber
          })
          .eq('uuid', turn.uuid);
        
        if (error) throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedTurn(null);
      toast({
        title: "Success",
        description: `Turn ${isCreateDialogOpen ? 'created' : 'updated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!gameId || gameId.trim() === '') {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Invalid Game ID</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Unable to load turns: No game ID provided.</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Error Loading Turns</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">There was an error loading the turns. Please try again later.</p>
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
          <Button onClick={() => {
            setSelectedTurn(null);
            setIsCreateDialogOpen(true);
          }} className="gap-2">
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
                          onEditOptions={(turn) => {
                            setSelectedTurn(turn);
                            setIsOptionsDialogOpen(true);
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
        onSave={handleSaveTurn}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => selectedTurn && handleDeleteTurn(selectedTurn.uuid)}
      />

      {selectedTurn && (
        <OptionsEditDialog
          turnId={selectedTurn.uuid}
          gameId={gameId}
          open={isOptionsDialogOpen}
          onOpenChange={setIsOptionsDialogOpen}
        />
      )}
    </Card>
  );
};

export default TurnsSection;
