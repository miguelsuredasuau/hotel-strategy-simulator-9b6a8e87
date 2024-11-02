import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

const GameEditionDashboard = () => {
  const [gameName, setGameName] = useState('');
  const [inspirationalImage, setInspirationalImage] = useState('');
  const [teams, setTeams] = useState([]);
  const [turns, setTurns] = useState([]);
  const [isGamemaster, setIsGamemaster] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'gamemaster') {
        toast({
          title: "Access Denied",
          description: "Only gamemasters can access this page",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsGamemaster(true);
      fetchTeamsAndTurns();
    };

    checkRole();
  }, [navigate, toast]);

  const fetchTeamsAndTurns = async () => {
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('*');

    if (teamsError) {
      toast({
        title: "Error fetching teams",
        description: teamsError.message,
        variant: "destructive",
      });
      return;
    }

    const { data: turnsData, error: turnsError } = await supabase
      .from('Turns')
      .select('*');

    if (turnsError) {
      toast({
        title: "Error fetching turns",
        description: turnsError.message,
        variant: "destructive",
      });
      return;
    }

    setTeams(teamsData);
    setTurns(turnsData);
  };

  const handleSaveGame = async () => {
    try {
      const { data, error } = await supabase
        .from('Games')
        .insert([
          { name: gameName, status: 'active' }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game saved successfully",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Error saving game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isGamemaster) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Game Edition Dashboard</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Game Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gameName">Game Name</Label>
                <Input
                  id="gameName"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Enter game name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Inspirational Image URL</Label>
                <Input
                  id="imageUrl"
                  value={inspirationalImage}
                  onChange={(e) => setInspirationalImage(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participating Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center space-x-2">
                    <Checkbox id={`team-${team.id}`} />
                    <Label htmlFor={`team-${team.id}`}>{team.teamname}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Game Turns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {turns.map((turn) => (
                  <Card key={turn.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <Label>Turn {turn.turnnumber}</Label>
                        <Input
                          value={turn.challenge || ''}
                          onChange={(e) => {
                            // Update turn challenge logic here
                          }}
                          placeholder="Enter turn challenge"
                        />
                        <Input
                          value={turn.description || ''}
                          onChange={(e) => {
                            // Update turn description logic here
                          }}
                          placeholder="Enter turn description"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveGame}>Save Game</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEditionDashboard;