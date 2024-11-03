import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, ChevronDown, ChevronRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import CreateTeamDialog from './CreateTeamDialog';
import TeamCard from './TeamCard';
import TeamEditDialog from './TeamEditDialog';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { Team } from '@/types/game';

interface TeamsSectionProps {
  gameId?: string;
}

const TeamsSection = ({ gameId }: TeamsSectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Team[];
    },
  });

  const handleDeleteTeam = async (teamUuid: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('uuid', teamUuid);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Success",
        description: "Team deleted successfully",
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
    if (!result.destination || !teams) return;

    const items = Array.from(teams);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    queryClient.setQueryData(['teams'], items);
  };

  return (
    <Card className="mt-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger className="hover:opacity-75">
              {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </CollapsibleTrigger>
            <Users className="h-5 w-5" />
            <CardTitle>Teams Management</CardTitle>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Team
          </Button>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="teams">
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
                    ) : teams?.length ? (
                      teams.map((team, index) => (
                        <TeamCard
                          key={team.uuid}
                          team={team}
                          index={index}
                          onEditTeam={(team) => {
                            setSelectedTeam(team);
                            setIsEditDialogOpen(true);
                          }}
                          onDeleteTeam={(team) => {
                            setSelectedTeam(team);
                            setIsDeleteDialogOpen(true);
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No teams created yet
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

      <CreateTeamDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />

      <TeamEditDialog
        team={selectedTeam}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => selectedTeam && handleDeleteTeam(selectedTeam.uuid)}
      />
    </Card>
  );
};

export default TeamsSection;
