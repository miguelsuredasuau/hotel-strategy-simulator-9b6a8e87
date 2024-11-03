import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import TeamMenu from "./TeamMenu";

interface HeaderProps {
  currentTurn: number;
  totalTurns: number;
  onTurnSelect: (turn: number) => void;
  children?: React.ReactNode;
}

const Header = ({ currentTurn, totalTurns, onTurnSelect, children }: HeaderProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-hotel-text">THE HOTEL GAME</h1>
        {children}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-hotel-primary" />
          <div className="flex gap-1 items-center">
            {Array.from({ length: totalTurns }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                  i + 1 === currentTurn
                    ? "bg-hotel-primary text-white"
                    : i + 1 < currentTurn
                    ? "bg-hotel-accent text-hotel-primary"
                    : "bg-gray-100 text-hotel-muted"
                }`}
                onClick={() => onTurnSelect(i + 1)}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-hotel-accent text-hotel-primary px-4 py-2 rounded-lg font-medium">
          €4,000,000
        </div>
        <TeamMenu />
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;