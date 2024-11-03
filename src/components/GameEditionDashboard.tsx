import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import DashboardHeader from './GameEdition/Dashboard/DashboardHeader';
import { useGameData } from '@/hooks/useGameData';
import { useGameMasterCheck } from './GameEdition/Dashboard/useGameMasterCheck';
import TurnsSection from './GameEdition/TurnsManagement/TurnsSection';

const GameEditionDashboard = () => {
  const { gameId = '' } = useParams();
  const isGamemaster = useGameMasterCheck();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { gameData } = useGameData(gameId);

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
        
        {gameData && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-2">{gameData.name}</h1>
              {gameData.description && (
                <p className="text-gray-600">{gameData.description}</p>
              )}
            </div>
            
            <TurnsSection gameId={gameId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameEditionDashboard;