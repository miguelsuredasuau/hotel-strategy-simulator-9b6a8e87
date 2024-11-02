import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import TurnEditDialog from './GameEdition/TurnEditDialog';
import OptionsEditDialog from './GameEdition/OptionsEditDialog';
import DeleteConfirmDialog from './GameEdition/DeleteConfirmDialog';
import GameEditionHeader from './GameEdition/GameEditionHeader';
import DashboardContent from './GameEdition/DashboardContent';
import { useGameData } from '@/hooks/useGameData';
import { Turn } from '@/types/game';

const GameEditionDashboard = () => {
  const { gameId } = useParams();
  const [isGamemaster, setIsGamemaster] = useState(false);
  const [isNewTurnOpen, setIsNewTurnOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null);
  const [showingOptions, setShowingOptions] = useState(false);
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
        
        <DashboardContent
          gameId={gameId!}
          gameData={gameData}
          turnsData={turnsData}
          showingOptions={showingOptions}
          onEditOptions={(turn) => {
            setSelectedTurn(turn);
            setShowingOptions(true);
            setIsOptionsOpen(true);
          }}
          onEditTurn={(turn) => {
            setSelectedTurn(turn);
            setIsEditOpen(true);
          }}
          onDeleteTurn={(turn) => {
            setSelectedTurn(turn);
            setIsDeleteOpen(true);
          }}
          onAddTurn={() => setIsNewTurnOpen(true)}
        />

        {isNewTurnOpen && (
          <TurnEditDialog
            turn={{ id: 0, turnnumber: turnsData ? turnsData.length + 1 : 1, game: parseInt(gameId!) }}
            open={isNewTurnOpen}
            onOpenChange={setIsNewTurnOpen}
            onSave={handleCreateTurn}
          />
        )}

        {selectedTurn && (
          <>
            <TurnEditDialog
              turn={selectedTurn}
              open={isEditOpen}
              onOpenChange={setIsEditOpen}
              onSave={(updatedTurn) => {
                queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
                setIsEditOpen(false);
                toast({
                  title: "Turn updated",
                  description: "The turn has been successfully updated.",
                });
              }}
            />
            <OptionsEditDialog
              turnId={selectedTurn.id}
              gameId={selectedTurn.game}
              open={isOptionsOpen}
              onOpenChange={(open) => {
                setIsOptionsOpen(open);
                if (!open) setShowingOptions(false);
              }}
            />
            <DeleteConfirmDialog
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              onConfirm={async () => {
                try {
                  const { error } = await supabase
                    .from('Turns')
                    .delete()
                    .eq('id', selectedTurn.id);
                  
                  if (error) throw error;
                  
                  queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
                  setIsDeleteOpen(false);
                  toast({
                    title: "Turn deleted",
                    description: "The turn has been successfully deleted.",
                  });
                } catch (error: any) {
                  toast({
                    title: "Error deleting turn",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GameEditionDashboard;