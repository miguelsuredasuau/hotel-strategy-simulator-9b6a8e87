import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeamMenu from "@/components/Header/TeamMenu";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useGameData } from "@/hooks/useGameData";

export interface GameEditionHeaderProps {
  title?: string;
  showBackButton?: boolean;
  gameId?: string;
}

const GameEditionHeader = ({ 
  title,
  showBackButton = true,
  gameId
}: GameEditionHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useSessionContext();
  const { gameData } = useGameData(gameId || '');

  const handleLogout = async () => {
    try {
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }
      
      queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button 
            variant="ghost" 
            onClick={() => navigate('/game-edition')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
        )}
        <h1 className="text-2xl font-bold">
          {gameData?.name || title || "Game Edition"}
        </h1>
      </div>
      <TeamMenu onLogout={handleLogout} />
    </div>
  );
};

export default GameEditionHeader;