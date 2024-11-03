import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/Dashboard";
import GameHeader from "@/components/GameHeader";
import { TurnContent } from "./components/TurnContent";
import { useGameSetup } from "./hooks/useGameSetup";
import type { Option } from "@/types/game";

const TOTAL_TURNS = 20;

const Index = () => {
  const [currentTurn, setCurrentTurn] = useState(1);
  const [latestTurn, setLatestTurn] = useState(1);
  const [selectedTurnNumber, setSelectedTurnNumber] = useState<number | null>(null);
  const { gameId, loading: gameLoading } = useGameSetup();
  const { toast } = useToast();

  // Check if the current turn has a selected option
  const { data: selectedOption, isLoading: optionLoading } = useQuery({
    queryKey: ['selected-option', gameId, selectedTurnNumber || currentTurn],
    queryFn: async () => {
      const { data: turn } = await supabase
        .from('Turns')
        .select('uuid')
        .eq('game_uuid', gameId)
        .eq('turnnumber', selectedTurnNumber || currentTurn)
        .single();

      if (!turn) return null;

      const { data: options } = await supabase
        .from('Options')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('turn_uuid', turn.uuid);

      return (options as Option[])?.[0] || null;
    },
    enabled: !!gameId
  });

  // Find the latest completed turn
  useEffect(() => {
    const findLatestCompletedTurn = async () => {
      if (!gameId) return;

      for (let turn = 1; turn <= TOTAL_TURNS; turn++) {
        const { data: turnData } = await supabase
          .from('Turns')
          .select('uuid')
          .eq('game_uuid', gameId)
          .eq('turnnumber', turn)
          .single();

        if (!turnData) break;

        const { data: options } = await supabase
          .from('Options')
          .select('*')
          .eq('game_uuid', gameId)
          .eq('turn_uuid', turnData.uuid);

        if (!options?.[0]) {
          setLatestTurn(turn);
          if (!selectedTurnNumber) {
            setCurrentTurn(turn);
          }
          break;
        }

        setLatestTurn(turn);
      }
    };

    findLatestCompletedTurn();
  }, [gameId, selectedTurnNumber]);

  const handleTurnClick = (turnNumber: number) => {
    if (turnNumber <= latestTurn) {
      setSelectedTurnNumber(turnNumber);
    }
  };

  const handleHotelSelect = () => {
    // After selecting an option, refresh the latest turn data
    const newLatestTurn = Math.max(latestTurn, selectedTurnNumber || currentTurn);
    setLatestTurn(newLatestTurn);
  };

  const handleNextTurn = () => {
    if (currentTurn < TOTAL_TURNS) {
      const nextTurn = currentTurn + 1;
      setCurrentTurn(nextTurn);
      setLatestTurn(Math.max(latestTurn, nextTurn));
      setSelectedTurnNumber(null);
    }
  };

  if (gameLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Game...</h1>
          <p className="text-gray-600">Please wait while we load your game data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader 
        currentTurn={selectedTurnNumber || currentTurn} 
        totalTurns={TOTAL_TURNS} 
        onTurnClick={handleTurnClick}
        latestTurn={latestTurn}
      />
      
      {!optionLoading && selectedOption ? (
        <Dashboard 
          onNextTurn={handleNextTurn} 
          gameId={gameId || ''} 
          turnNumber={selectedTurnNumber || currentTurn}
          isCurrentTurn={!selectedTurnNumber || selectedTurnNumber === currentTurn}
        />
      ) : (
        <TurnContent
          gameId={gameId || ''}
          currentTurn={selectedTurnNumber || currentTurn}
          onHotelSelect={handleHotelSelect}
        />
      )}

      <Toaster />
    </div>
  );
};

export default Index;