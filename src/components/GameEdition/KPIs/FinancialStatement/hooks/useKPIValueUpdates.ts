import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useKPIValueUpdates = (gameId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleKPIValueChange = async (kpiUuid: string | undefined, newValue: number) => {
    if (!kpiUuid || !gameId) {
      console.error('Missing required kpiUuid or gameId');
      return;
    }

    try {
      const { error } = await supabase
        .from('kpis')
        .update({ current_value: newValue })
        .eq('uuid', kpiUuid)
        .eq('game_uuid', gameId);

      if (error) throw error;

      await queryClient.invalidateQueries({ 
        queryKey: ['kpis', gameId] 
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