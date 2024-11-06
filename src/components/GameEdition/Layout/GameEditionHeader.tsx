import { Button } from "@/components/ui/button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface GameEditionHeaderProps {
  gameId?: string;
  onLogout?: () => void;
}

const GameEditionHeader = ({ gameId, onLogout }: GameEditionHeaderProps) => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      if (onLogout) onLogout();
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Game Edition Dashboard</h1>
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default GameEditionHeader;