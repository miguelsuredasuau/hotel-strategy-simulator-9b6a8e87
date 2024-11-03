import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import TeamAssignDialog from './TeamAssignDialog';
import { Team } from '@/types/game';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { useNavigate } from 'react-router-dom';

interface GameTeamsSectionProps {
  gameId: string;
}

const GameTeamsSection = ({ gameId }: GameTeamsSectionProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeamUuid, setSelectedTeamUuid] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: assignedTeams = [], isLoading } = useQuery({
    queryKey: ['game-teams', gameId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return [];
      }

      const { data, error } = await supabase
        .from('game_teams')
        .select(`
          teams:team_uuid (
            uuid,
            teamname,
            teamlogo,
            email,
            created_at
          )
        `)
        .eq('game_uuid', gameId);

      if (error) throw error;
      
      // Ensure we're returning an array of Team objects with all required properties
      return (data?.map(item => ({
        uuid: item.teams.uuid,
        teamname: item.teams.teamname,
        teamlogo: item.teams.teamlogo,
        email: item.teams.email,
        created_at: item.teams.created_at
      })) || []) as Team[];
    },
  });

  const handleDeleteTeam = async () => {
    if (!selectedTeamUuid) return;

    try {
      const { error } = await supabase
        .from('game_teams')
        .delete()
        .eq('game_uuid', gameId)
        .eq('team_uuid', selectedTeamUuid);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['game-teams', gameId] });
      toast({
        title: "Success",
        description: "Team removed from game successfully",
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Assigned Teams</CardTitle>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Assign Teams
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : assignedTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedTeams.map((team) => (
              <div
                key={team.uuid}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    {team.teamlogo ? (
                      <img
                        src={team.teamlogo}
                        alt={team.teamname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-full h-full p-2 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{team.teamname}</h3>
                    <p className="text-sm text-gray-500">{team.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setSelectedTeamUuid(team.uuid);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No teams assigned to this game yet
          </p>
        )}
      </CardContent>

      <TeamAssignDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        gameId={gameId}
        assignedTeams={assignedTeams}
        onTeamsAssigned={() => {
          queryClient.invalidateQueries({ queryKey: ['game-teams', gameId] });
        }}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTeam}
      />
    </Card>
  );
};

export default GameTeamsSection;