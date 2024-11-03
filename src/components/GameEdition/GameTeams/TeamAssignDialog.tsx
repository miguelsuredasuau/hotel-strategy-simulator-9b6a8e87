import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Team } from "@/types/game";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface TeamAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  assignedTeams: Team[];
  onTeamsAssigned: () => void;
}

const TeamAssignDialog = ({
  open,
  onOpenChange,
  gameId,
  assignedTeams,
  onTeamsAssigned,
}: TeamAssignDialogProps) => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>(
    assignedTeams.map((team) => team.uuid)
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: allTeams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('teamname');

      if (error) throw error;
      return data as Team[];
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Remove existing assignments
      await supabase
        .from('game_teams')
        .delete()
        .eq('game_uuid', gameId);

      // Add new assignments
      if (selectedTeams.length > 0) {
        const { error } = await supabase
          .from('game_teams')
          .insert(
            selectedTeams.map((teamId) => ({
              game_uuid: gameId,
              team_uuid: teamId,
            }))
          );

        if (error) throw error;
      }

      onTeamsAssigned();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Teams to Game</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {allTeams.map((team) => (
            <div key={team.uuid} className="flex items-center space-x-2">
              <Checkbox
                id={team.uuid}
                checked={selectedTeams.includes(team.uuid)}
                onCheckedChange={(checked) => {
                  setSelectedTeams(
                    checked
                      ? [...selectedTeams, team.uuid]
                      : selectedTeams.filter((id) => id !== team.uuid)
                  );
                }}
              />
              <label
                htmlFor={team.uuid}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {team.teamname}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamAssignDialog;