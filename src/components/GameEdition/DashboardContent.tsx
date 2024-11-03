import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Game, Turn } from "@/types/game";
import GameTeamsSection from "./GameTeams/GameTeamsSection";

interface DashboardContentProps {
  gameId: string;
  gameData: Game;
  turnsData: Turn[];
  showingOptions: boolean;
  onEditOptions: (turn: Turn) => void;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
  onAddTurn: () => void;
}

const DashboardContent = ({
  gameId,
  gameData,
  turnsData,
  showingOptions,
  onEditOptions,
  onEditTurn,
  onDeleteTurn,
  onAddTurn
}: DashboardContentProps) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{gameData?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{gameData?.description}</p>
        </CardContent>
      </Card>

      <GameTeamsSection gameId={gameId} />
    </div>
  );
};

export default DashboardContent;