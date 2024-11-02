import GameDetailsCard from './GameDetailsCard';
import TeamsCard from './GameEdition/TeamsCard';
import TurnsCard from './GameEdition/TurnsCard';
import { Turn } from '@/types/game';
import { useQueryClient } from "@tanstack/react-query";

interface DashboardContentProps {
  gameId: string;
  gameData: any;
  turnsData: Turn[] | undefined;
  onEditOptions: (turn: Turn) => void;
  onEditTurn: (turn: Turn) => void;
  onDeleteTurn: (turn: Turn) => void;
  onAddTurn: () => void;
  showingOptions: boolean;
}

const DashboardContent = ({ 
  gameId, 
  gameData, 
  turnsData,
  onEditOptions,
  onEditTurn,
  onDeleteTurn,
  onAddTurn,
  showingOptions
}: DashboardContentProps) => {
  const queryClient = useQueryClient();

  if (showingOptions) {
    return (
      <TurnsCard 
        turns={turnsData || []} 
        onEditOptions={onEditOptions}
        onEditTurn={onEditTurn}
        onDeleteTurn={onDeleteTurn}
        onAddTurn={onAddTurn}
      />
    );
  }

  return (
    <div className="space-y-6">
      <GameDetailsCard
        gameId={parseInt(gameId)}
        gameName={gameData?.name || ''}
        inspirationalImage={gameData?.inspirational_image || ''}
        setGameName={(name) => queryClient.invalidateQueries({ queryKey: ['game', gameId] })}
        setInspirationalImage={(image) => queryClient.invalidateQueries({ queryKey: ['game', gameId] })}
      />
      <TeamsCard gameId={parseInt(gameId)} />
      <TurnsCard 
        turns={turnsData || []} 
        onEditOptions={onEditOptions}
        onEditTurn={onEditTurn}
        onDeleteTurn={onDeleteTurn}
        onAddTurn={onAddTurn}
      />
    </div>
  );
};

export default DashboardContent;