import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import GameDetailsCard from './GameEdition/GameDetailsCard';
import TeamsCard from './GameEdition/TeamsCard';
import TurnsCard from './GameEdition/TurnsCard';
import TurnEditDialog from './GameEdition/TurnEditDialog';
import GameEditionHeader from './GameEdition/GameEditionHeader';
import { useGameData } from '@/hooks/useGameData';

const GameEditionDashboard = () => {
  const { gameId } = useParams();
  const [isGamemaster, setIsGamemaster] = useState(false);
  const [isNewTurnOpen, setIsNewTurnOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { gameData, turnsData } = useGameData(gameId);

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
    };

    checkRole();
  }, [navigate, toast]);

  const handleCreateTurn = async (turn: any) => {
    try {
      const newTurnNumber = turnsData ? turnsData.length + 1 : 1;
      const { data, error } = await supabase
        .from('Turns')
        .insert({
          challenge: turn.challenge,
          description: turn.description,
          turnnumber: newTurnNumber,
          game: parseInt(gameId!)
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
      setIsNewTurnOpen(false);
      toast({
        title: "Success",
        description: "Turn created successfully",
      });
    } catch (error: any) {
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
        <GameEditionHeader onLogout={handleLogout} />

        <div className="space-y-6">
          <GameDetailsCard
            gameId={parseInt(gameId!)}
            gameName={gameData?.name || ''}
            inspirationalImage={gameData?.inspirational_image || ''}
            setGameName={(name) => queryClient.invalidateQueries({ queryKey: ['game', gameId] })}
            setInspirationalImage={(image) => queryClient.invalidateQueries({ queryKey: ['game', gameId] })}
          />
          <TeamsCard teams={[]} />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Game Turns</h2>
            <Button onClick={() => setIsNewTurnOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Turn
            </Button>
          </div>
          <TurnsCard turns={turnsData || []} />
          {isNewTurnOpen && (
            <TurnEditDialog
              turn={{ id: 0, turnnumber: turnsData ? turnsData.length + 1 : 1 }}
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