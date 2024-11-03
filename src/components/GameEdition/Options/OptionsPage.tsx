import { useParams } from "react-router-dom";
import { useGameMasterCheck } from "../Dashboard/useGameMasterCheck";
import OptionsSection from "./OptionsSection";
import GameEditionHeader from "../Layout/GameEditionHeader";

const OptionsPage = () => {
  const { gameId = "", turnId = "" } = useParams();
  const isGamemaster = useGameMasterCheck();

  if (!isGamemaster) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GameEditionHeader title="Options Management" />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <OptionsSection gameId={gameId} turnId={turnId} />
      </div>
    </div>
  );
};

export default OptionsPage;