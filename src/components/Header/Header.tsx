import { Button } from "@/components/ui/button";
import TeamMenu from "./TeamMenu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  children?: React.ReactNode;
  currentTurn?: number;
  totalTurns?: number;
  onTurnSelect?: (turn: number) => void;
}

const Header = ({ children, currentTurn, totalTurns, onTurnSelect }: HeaderProps) => {
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
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {children}
          </div>
          <TeamMenu onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;