import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useKPIValueUpdates = (gameId: string, turnId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleKPIValueChange = async (kpiUuid: string | undefined, newValue: number) => {
    if (!kpiUuid) return;

    try {
      // First check if a value already exists
      const { data: existingValue } = await supabase
        .from('kpi_values')
        .select('*')
        .eq('kpi_uuid', kpiUuid)
        .eq('game_uuid', gameId)
        .eq('turn_uuid', turnId)
        .maybeSingle();

      const kpiValue = {
        kpi_uuid: kpiUuid,
        game_uuid: gameId,
        turn_uuid: turnId,
        value: newValue
      };

      if (existingValue) {
        const { error } = await supabase
          .from('kpi_values')
          .update({ value: newValue })
          .eq('uuid', existingValue.uuid);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('kpi_values')
          .insert([kpiValue]);

        if (error) throw error;
      }

      // Invalidate queries to refetch the latest data
      await queryClient.invalidateQueries({ queryKey: ['kpi-values', gameId, turnId] });
      
      toast({
        title: "Success",
        description: "Value updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleKPIValueChange };
};