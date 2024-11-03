import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Turn } from "@/types/game";

export const useTurnsQuery = (gameId: string) => {
  const { data: turns, isLoading, isError } = useQuery({
    queryKey: ['turns', gameId],
    queryFn: async () => {
      if (!gameId || gameId.trim() === '') {
        throw new Error('Invalid game ID');
      }

      const { data, error } = await supabase
        .from('Turns')
        .select('uuid, turnnumber, challenge, description, game_uuid, created_at')
        .eq('game_uuid', gameId)
        .order('turnnumber');

      if (error) throw error;
      return data as Turn[];
    },
    enabled: !!gameId && gameId.trim() !== ''
  });

  return { turns, isLoading, isError };
};