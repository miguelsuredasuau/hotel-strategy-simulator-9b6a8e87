import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useGameData = (gameId: string | undefined) => {
  const { toast } = useToast();

  const { data: gameData, error: gameError } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      if (!gameId) return null;
      
      const { data, error } = await supabase
        .from('Games')
        .select('*')
        .eq('id', parseInt(gameId))
        .single();

      if (error) {
        toast({
          title: "Error fetching game",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!gameId
  });

  const { data: turnsData, error: turnsError } = useQuery({
    queryKey: ['turns', gameId],
    queryFn: async () => {
      if (!gameId) return [];
      
      const { data, error } = await supabase
        .from('Turns')
        .select('*')
        .eq('game', parseInt(gameId))
        .order('turnnumber');

      if (error) {
        toast({
          title: "Error fetching turns",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
    enabled: !!gameId
  });

  return {
    gameData,
    gameError,
    turnsData,
    turnsError
  };
};