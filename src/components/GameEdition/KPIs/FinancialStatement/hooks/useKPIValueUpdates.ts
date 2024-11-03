import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useKPIValueUpdates = (gameId: string, turnId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleKPIValueChange = async (kpiUuid: string | undefined, newValue: number) => {
    if (!kpiUuid) return;

    try {
      const { error } = await supabase
        .from('kpi_values')
        .upsert({
          kpi_uuid: kpiUuid,
          game_uuid: gameId,
          turn_uuid: turnId,
          value: newValue
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpi-values', gameId, turnId] });
      
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