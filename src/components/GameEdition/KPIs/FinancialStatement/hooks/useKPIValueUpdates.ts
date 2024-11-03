import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useKPIValueUpdates = (gameId: string, turnId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleKPIValueChange = async (kpiUuid: string | undefined, newValue: number) => {
    if (!kpiUuid || !gameId) {
      console.error('Missing required kpiUuid or gameId');
      return;
    }

    try {
      const kpiValue = {
        kpi_uuid: kpiUuid,
        game_uuid: gameId,
        turn_uuid: turnId,
        value: newValue
      };

      // First check if a value already exists
      const { data: existingValue, error: fetchError } = await supabase
        .from('kpi_values')
        .select('uuid')
        .eq('kpi_uuid', kpiUuid)
        .eq('game_uuid', gameId)
        .eq('turn_uuid', turnId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let result;
      
      if (existingValue) {
        // Update existing value
        result = await supabase
          .from('kpi_values')
          .update({ value: newValue })
          .eq('uuid', existingValue.uuid);
      } else {
        // Insert new value
        result = await supabase
          .from('kpi_values')
          .insert([kpiValue]);
      }

      if (result.error) throw result.error;

      // Invalidate queries to refetch the latest data
      await queryClient.invalidateQueries({ 
        queryKey: ['kpi-values', gameId, turnId] 
      });
      
      toast({
        title: "Success",
        description: "Value updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating KPI value:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleKPIValueChange };
};