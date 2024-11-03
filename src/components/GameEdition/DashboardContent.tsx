import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Game, Turn } from "@/types/game";

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
    <Card>
      <CardHeader>
        <CardTitle>{gameData?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{gameData?.description}</p>
        {/* Add your turns list rendering here */}
      </CardContent>
    </Card>
  );
};

export default DashboardContent;