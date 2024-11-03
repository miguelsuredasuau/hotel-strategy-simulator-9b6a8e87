import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeamMenu from "@/components/Header/TeamMenu";

interface GameEditionHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const GameEditionHeader = ({ title = "Game Edition Dashboard", showBackButton = true }: GameEditionHeaderProps) => {
  const navigate = useNavigate();

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
      <TeamMenu />
    </div>
  );
};

export default GameEditionHeader;