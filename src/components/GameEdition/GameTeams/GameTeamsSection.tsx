import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Team } from "@/types/game";
import TeamAssignDialog from './TeamAssignDialog';

interface GameTeamsSectionProps {
  gameId: string;
}

const GameTeamsSection = ({ gameId }: GameTeamsSectionProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assignedTeams = [], isLoading } = useQuery({
    queryKey: ['game-teams', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('round_teams')
        .select(`
          teams: team_uuid (
            uuid,
            teamname,
            teamlogo,
            email,
            created_at
          )
        `)
        .eq('game_uuid', gameId);

      if (error) throw error;
      
      // Transform the data to match the Team type
      return (data?.map(item => item.teams) || []) as Team[];
    },
  });

  const handleTeamAssigned = () => {
    queryClient.invalidateQueries({ queryKey: ['game-teams', gameId] });
    toast({
      title: "Success",
      description: "Team assignments updated successfully",
    });
  };

  return (
    <Card className="mt-8">
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
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
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
        onTeamsAssigned={handleTeamAssigned}
      />
    </Card>
  );
};

export default GameTeamsSection;