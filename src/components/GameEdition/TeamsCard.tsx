import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: number;
  teamname: string;
}

interface TeamsCardProps {
  gameId: number;
}

const TeamsCard = ({ gameId }: TeamsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First create the team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([
          { teamname: teamName, email: email }
        ])
        .select()
        .single();

      if (teamError) throw teamError;

      // Then create the user account
      const { data: userData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Update the user's profile with the team_id
      if (userData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ team_id: teamData.id })
          .eq('id', userData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Success",
        description: "Team and user created successfully",
      });

      setIsOpen(false);
      setTeamName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Participating Teams</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Team Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter team email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Team"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams?.map((team) => (
            <div key={team.id} className="flex items-center space-x-2">
              <Checkbox id={`team-${team.id}`} />
              <Label htmlFor={`team-${team.id}`}>{team.teamname}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamsCard;