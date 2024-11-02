import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameEditionHeaderProps {
  onLogout: () => void;
}

const GameEditionHeader = ({ onLogout }: GameEditionHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Game Edition Dashboard</h1>
      <div className="flex gap-4">
        <Button 
          variant="outline"
          onClick={() => navigate('/game-edition')}
        >
          Back to Games
        </Button>
        <Button 
          variant="ghost"
          onClick={onLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default GameEditionHeader;