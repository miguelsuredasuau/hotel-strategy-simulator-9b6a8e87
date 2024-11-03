import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeamMenu from "@/components/Header/TeamMenu";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GameEditionHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const GameEditionHeader = ({ 
  title = "Game Edition Dashboard", 
  showBackButton = true 
}: GameEditionHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      // Clear all queries first
      queryClient.clear();
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Clear any local storage items if needed
      localStorage.clear();
      // Navigate to login page
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
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <TeamMenu onLogout={handleLogout} />
    </div>
  );
};

export default GameEditionHeader;