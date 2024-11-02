import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import GameDetailsCard from './GameEdition/GameDetailsCard';
import TeamsCard from './GameEdition/TeamsCard';
import TurnsCard from './GameEdition/TurnsCard';

const GameEditionDashboard = () => {
  const [gameName, setGameName] = useState('');
  const [inspirationalImage, setInspirationalImage] = useState('');
  const [teams, setTeams] = useState([]);
  const [turns, setTurns] = useState([]);
  const [isGamemaster, setIsGamemaster] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
        navigate('/login');
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
    } catch (error) {
      toast({
        title: "Error saving game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out",
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Game Edition Dashboard</h1>
          <Button 
            variant="ghost"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="space-y-6">
          <GameDetailsCard
            gameName={gameName}
            inspirationalImage={inspirationalImage}
            setGameName={setGameName}
            setInspirationalImage={setInspirationalImage}
          />
          <TeamsCard teams={teams} />
          <TurnsCard turns={turns} />
          <div className="flex justify-end">
            <Button onClick={handleSaveGame}>Save Game</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEditionDashboard;