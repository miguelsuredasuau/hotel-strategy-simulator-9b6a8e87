import { useParams, useNavigate } from "react-router-dom";
import { useGameMasterCheck } from "../Dashboard/useGameMasterCheck";
import OptionsSection from "./OptionsSection";
import GameEditionHeader from "../Layout/GameEditionHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const OptionsPage = () => {
  const { gameId = "", turnId = "" } = useParams();
  const navigate = useNavigate();
  const isGamemaster = useGameMasterCheck();

  if (!isGamemaster) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GameEditionHeader title="Options Management" />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/game-edition/${gameId}`)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Game
        </Button>
        <OptionsSection gameId={gameId} turnId={turnId} />
      </div>
    </div>
  );
};

export default OptionsPage;