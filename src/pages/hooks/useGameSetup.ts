import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useGameSetup = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      } finally {
        setLoading(false);
      }
    };

    fetchActiveGame();
  }, [navigate, toast]);

  return { gameId, loading };
};