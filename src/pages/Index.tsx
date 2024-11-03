import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/Dashboard";
import HotelCard from "@/components/HotelCard";
import GameHeader from "@/components/GameHeader";
import { useNavigate } from "react-router-dom";
import { Option, Turn } from "@/types/game";
import { Loader2 } from "lucide-react";
import { TurnContent } from "./components/TurnContent";
import { useGameSetup } from "./hooks/useGameSetup";

const TOTAL_TURNS = 20;

const Index = () => {
  const [currentTurn, setCurrentTurn] = useState(1);
  const [latestTurn, setLatestTurn] = useState(1);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedTurnNumber, setSelectedTurnNumber] = useState<number | null>(null);
  const { gameId, loading: gameLoading } = useGameSetup();
  const { toast } = useToast();

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

  useEffect(() => {
    if (!optionLoading) {
      setShowDashboard(!!selectedOption);
    }
  }, [selectedOption, optionLoading]);

  const handleTurnClick = (turnNumber: number) => {
    if (turnNumber <= latestTurn) {
      setSelectedTurnNumber(turnNumber);
    }
  };

  const handleHotelSelect = () => {
    setShowDashboard(true);
  };

  const handleNextTurn = () => {
    if (currentTurn < TOTAL_TURNS) {
      const nextTurn = currentTurn + 1;
      setCurrentTurn(nextTurn);
      setLatestTurn(prev => Math.max(prev, nextTurn));
      setSelectedTurnNumber(null);
    }
    setShowDashboard(false);
  };

  // Add a proper type to the event parameter
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key && event.key.toLowerCase() === 'escape') {
      // Handle escape key press
      setShowDashboard(false);
    }
  };

  useEffect(() => {
    // Add event listener with proper typing
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array since handleKeyDown doesn't depend on any state

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
      
      {showDashboard ? (
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