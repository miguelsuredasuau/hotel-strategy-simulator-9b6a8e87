import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useGameKPIs = (gameId: string) => {
  return useQuery({
    queryKey: ['kpis', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId)
        .order('created_at');

      if (error) throw error;
      return data;
    },
    enabled: !!gameId,
  });
};