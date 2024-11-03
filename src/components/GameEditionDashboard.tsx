import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import TurnEditDialog from './GameEdition/TurnEditDialog';
import OptionsEditDialog from './GameEdition/OptionsEditDialog';
import DeleteConfirmDialog from './GameEdition/DeleteConfirmDialog';
import DashboardContent from './GameEdition/DashboardContent';
import { useGameData } from '@/hooks/useGameData';
import { useGameMasterCheck } from './GameEdition/Dashboard/useGameMasterCheck';
import { useTurnManagement } from './GameEdition/Dashboard/useTurnManagement';
import DashboardHeader from './GameEdition/Dashboard/DashboardHeader';

const GameEditionDashboard = () => {
  const { gameId } = useParams();
  const isGamemaster = useGameMasterCheck();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { gameData, turnsData } = useGameData(gameId);
  
  const {
    isNewTurnOpen,
    setIsNewTurnOpen,
    isOptionsOpen,
    setIsOptionsOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedTurn,
    setSelectedTurn,
    showingOptions,
    setShowingOptions,
    handleCreateTurn,
  } = useTurnManagement(gameId!);

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
        <DashboardHeader onLogout={handleLogout} />
        
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