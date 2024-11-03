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

      const { error } = await supabase
        .from('kpi_values')
        .upsert({
          uuid: existingValue?.uuid, // Include the UUID if updating
          kpi_uuid: kpiUuid,
          game_uuid: gameId,
          turn_uuid: turnId,
          value: newValue
        });

      if (error) throw error;

      // Immediately update the cache with the new value
      queryClient.setQueryData(['kpi-values', gameId, turnId], (oldData: any) => {
        if (!oldData) return [{ kpi_uuid: kpiUuid, value: newValue, game_uuid: gameId, turn_uuid: turnId }];
        
        const newData = oldData.map((item: any) => 
          item.kpi_uuid === kpiUuid ? { ...item, value: newValue } : item
        );
        
        if (!newData.some((item: any) => item.kpi_uuid === kpiUuid)) {
          newData.push({ kpi_uuid: kpiUuid, value: newValue, game_uuid: gameId, turn_uuid: turnId });
        }
        
        return newData;
      });

      // Then invalidate to ensure consistency
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