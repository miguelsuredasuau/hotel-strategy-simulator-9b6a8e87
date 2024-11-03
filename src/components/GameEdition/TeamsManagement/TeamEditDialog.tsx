import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Team } from "@/types/game";

interface TeamEditDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamEditDialog = ({ team, open, onOpenChange }: TeamEditDialogProps) => {
  const [teamName, setTeamName] = useState("");
  const [teamLogo, setTeamLogo] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (team) {
      setTeamName(team.teamname || "");
      setTeamLogo(team.teamlogo || "");
      setEmail(team.email || "");
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          teamname: teamName,
          teamlogo: teamLogo,
          email: email
        })
        .eq('uuid', team.uuid);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Success",
        description: "Team updated successfully",
      });
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
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
            />
          </div>
          <div>
            <Label htmlFor="teamLogo">Team Logo URL</Label>
            <Input
              id="teamLogo"
              value={teamLogo}
              onChange={(e) => setTeamLogo(e.target.value)}
              placeholder="Enter logo URL"
            />
          </div>
          <div>
            <Label htmlFor="email">Team Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter team email"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamEditDialog;