import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Game } from "@/types/game";

export const useGameData = (gameId: string | undefined) => {
  const { toast } = useToast();

  const { 
    data: gameData, 
    error: gameError,
    isLoading 
  } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      if (!gameId) return null;
      
      const { data, error } = await supabase
        .from('Games')
        .select('*')
        .eq('uuid', gameId)
        .single();

      if (error) {
        toast({
          title: "Error fetching game",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Game;
    },
    enabled: !!gameId
  });

  return {
    gameData,
    gameError,
    isLoading
  };
};