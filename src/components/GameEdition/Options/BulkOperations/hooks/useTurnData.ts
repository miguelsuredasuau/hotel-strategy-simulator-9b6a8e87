import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Turn } from "@/types/game";

export const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const useTurnData = (turnId: string, open: boolean) => {
  return useQuery({
    queryKey: ['turn', turnId],
    queryFn: async () => {
      if (!turnId || !isValidUUID(turnId)) {
        throw new Error('Invalid turn ID format');
      }

      const { data, error } = await supabase
        .from('Turns')
        .select('*')
        .eq('uuid', turnId)
        .single();

      if (error) throw error;
      return data as Turn;
    },
    enabled: !!turnId && open && isValidUUID(turnId)
  });
};