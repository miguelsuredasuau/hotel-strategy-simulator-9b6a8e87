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

      console.log('Saving KPI value:', kpiValue); // Debug log

      // Upsert the value
      const { error } = await supabase
        .from('kpi_values')
        .upsert(kpiValue, {
          onConflict: 'kpi_uuid,game_uuid,turn_uuid'
        });

      if (error) throw error;

      // Invalidate queries to refetch the latest data
      await queryClient.invalidateQueries({ 
        queryKey: ['kpi-values', gameId, turnId] 
      });
      
      toast({
        title: "Success",
        description: "Value updated successfully",
      });

      console.log('KPI value saved successfully'); // Debug log
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