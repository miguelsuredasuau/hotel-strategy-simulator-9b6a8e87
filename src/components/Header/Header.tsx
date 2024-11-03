import { useSessionContext } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import MainNav from "./MainNav";
import TeamMenu from "./TeamMenu";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  currentTurn?: number;
  totalTurns?: number;
  onTurnSelect?: (turn: number) => void;
  children?: React.ReactNode;
}

const Header = ({ currentTurn, totalTurns, onTurnSelect, children }: HeaderProps) => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          {session?.user && (
            <TeamMenu onLogout={handleLogout} />
          )}
        </div>
        {children}
      </div>
    </header>
  );
};

export default Header;