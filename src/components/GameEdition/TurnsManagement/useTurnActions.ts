import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Turn } from "@/types/game";

export const useTurnActions = (gameId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteTurn = async (turnUuid: string) => {
    try {
      // First delete all options associated with this turn
      const { error: optionsError } = await supabase
        .from('Options')
        .delete()
        .eq('turn_uuid', turnUuid);

      if (optionsError) throw optionsError;

      // Then delete the turn
      const { error: turnError } = await supabase
        .from('Turns')
        .delete()
        .eq('uuid', turnUuid);

      if (turnError) throw turnError;

      queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
      toast({
        title: "Success",
        description: "Turn deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const turns = queryClient.getQueryData(['turns', gameId]) as Turn[];
    if (!turns) return;

    const items = Array.from(turns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedTurns = items.map((turn, index) => ({
      ...turn,
      turnnumber: index + 1
    }));

    try {
      for (const turn of updatedTurns) {
        const { error } = await supabase
          .from('Turns')
          .update({ turnnumber: turn.turnnumber })
          .eq('uuid', turn.uuid);
        
        if (error) throw error;
      }

      queryClient.setQueryData(['turns', gameId], updatedTurns);
      toast({
        title: "Success",
        description: "Turn order updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleDeleteTurn, handleDragEnd };
};