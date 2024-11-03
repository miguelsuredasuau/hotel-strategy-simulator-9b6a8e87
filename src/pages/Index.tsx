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

const TOTAL_TURNS = 20;

const Index = () => {
  const [currentTurn, setCurrentTurn] = useState(1);
  const [latestTurn, setLatestTurn] = useState(1);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedTurnNumber, setSelectedTurnNumber] = useState<number | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveGame = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('team_uuid, role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'gamemaster') {
          navigate('/game-edition');
          return;
        }

        if (!profile?.team_uuid) {
          toast({
            title: "No team assigned",
            description: "Please contact your game master to be assigned to a team.",
            variant: "destructive",
          });
          return;
        }

        const { data: gameTeam } = await supabase
          .from('game_teams')
          .select('game_uuid')
          .eq('team_uuid', profile.team_uuid)
          .single();

        if (gameTeam?.game_uuid) {
          setGameId(gameTeam.game_uuid);
        }
      } catch (error: any) {
        console.error('Error fetching active game:', error);
        toast({
          title: "Error",
          description: "Failed to load game data",
          variant: "destructive",
        });
      }
    };

    fetchActiveGame();
  }, [navigate, toast]);

  const { data: options, isLoading: optionsLoading } = useQuery({
    queryKey: ['options', gameId, currentTurn],
    queryFn: async () => {
      if (!gameId) return null;

      const { data: turn } = await supabase
        .from('Turns')
        .select('uuid')
        .eq('game_uuid', gameId)
        .eq('turnnumber', currentTurn)
        .single();

      if (!turn) return null;

      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('turn_uuid', turn.uuid)
        .order('optionnumber');

      if (error) throw error;
      return data as Option[];
    },
    enabled: !!gameId
  });

  const { data: turnData } = useQuery({
    queryKey: ['turn', gameId, selectedTurnNumber || currentTurn],
    queryFn: async () => {
      if (!gameId) return null;

      const { data, error } = await supabase
        .from('Turns')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('turnnumber', selectedTurnNumber || currentTurn)
        .single();

      if (error) throw error;
      return data as Turn;
    },
    enabled: !!gameId
  });

  const handleTurnClick = (turnNumber: number) => {
    if (turnNumber <= latestTurn) {
      setSelectedTurnNumber(turnNumber);
      setShowDashboard(true);
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

  if (!gameId) {
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
      
      {!showDashboard ? (
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-hotel-text mb-2">
              Turn {currentTurn}{turnData?.challenge ? `: ${turnData.challenge}` : ''}
            </h2>
            {turnData?.description && (
              <p className="text-gray-600">{turnData.description}</p>
            )}
          </div>

          {optionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : options && options.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {options.map((option) => (
                <HotelCard
                  key={option.uuid}
                  id={option.uuid}
                  name={option.title || ''}
                  description={option.description || ''}
                  image={option.image || `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop`}
                  onSelect={handleHotelSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No options available for this turn.</p>
            </div>
          )}
        </div>
      ) : (
        <Dashboard 
          onNextTurn={handleNextTurn} 
          gameId={gameId} 
          turnNumber={selectedTurnNumber || currentTurn}
          isCurrentTurn={!selectedTurnNumber || selectedTurnNumber === currentTurn}
        />
      )}

      <Toaster />
    </div>
  );
};

export default Index;