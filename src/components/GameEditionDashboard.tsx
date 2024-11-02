import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import GameDetailsCard from './GameEdition/GameDetailsCard';
import TeamsCard from './GameEdition/TeamsCard';
import TurnsCard from './GameEdition/TurnsCard';
import TurnEditDialog from './GameEdition/TurnEditDialog';

const GameEditionDashboard = () => {
  const { gameId } = useParams();
  const [gameName, setGameName] = useState('');
  const [inspirationalImage, setInspirationalImage] = useState('');
  const [teams, setTeams] = useState([]);
  const [turns, setTurns] = useState([]);
  const [isGamemaster, setIsGamemaster] = useState(false);
  const [isNewTurnOpen, setIsNewTurnOpen] = useState(false);
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
      fetchGameData();
    };

    checkRole();
  }, [navigate, toast, gameId]);

  const fetchGameData = async () => {
    const { data: gameData, error: gameError } = await supabase
      .from('Games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError) {
      toast({
        title: "Error fetching game",
        description: gameError.message,
        variant: "destructive",
      });
      navigate('/game-edition');
      return;
    }

    setGameName(gameData.name || '');

    const { data: turnsData, error: turnsError } = await supabase
      .from('Turns')
      .select('*')
      .eq('game', gameId)
      .order('turnnumber');

    if (turnsError) {
      toast({
        title: "Error fetching turns",
        description: turnsError.message,
        variant: "destructive",
      });
      return;
    }

    setTurns(turnsData || []);
  };

  const handleCreateTurn = async (turn) => {
    try {
      const newTurnNumber = turns.length + 1;
      const { data, error } = await supabase
        .from('Turns')
        .insert([
          { 
            challenge: turn.challenge,
            description: turn.description,
            turnnumber: newTurnNumber,
            game: gameId
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setTurns([...turns, data]);
      setIsNewTurnOpen(false);
      toast({
        title: "Success",
        description: "Turn created successfully",
      });
    } catch (error) {
      toast({
        title: "Error creating turn",
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
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => navigate('/game-edition')}
            >
              Back to Games
            </Button>
            <Button 
              variant="ghost"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <GameDetailsCard
            gameName={gameName}
            inspirationalImage={inspirationalImage}
            setGameName={setGameName}
            setInspirationalImage={setInspirationalImage}
          />
          <TeamsCard teams={teams} />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Game Turns</h2>
            <Button onClick={() => setIsNewTurnOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Turn
            </Button>
          </div>
          <TurnsCard turns={turns} />
          {isNewTurnOpen && (
            <TurnEditDialog
              turn={{ turnnumber: turns.length + 1 }}
              open={isNewTurnOpen}
              onOpenChange={setIsNewTurnOpen}
              onSave={handleCreateTurn}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameEditionDashboard;