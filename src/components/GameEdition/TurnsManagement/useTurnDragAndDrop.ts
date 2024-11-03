import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Turn } from "@/types/game";

export const useTurnDragAndDrop = (gameId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const turns = queryClient.getQueryData(['turns', gameId]) as Turn[];
    if (!turns) return;

    // Don't do anything if the position hasn't changed
    if (result.destination.index === result.source.index) return;

    const items = Array.from(turns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistically update the cache
    const updatedTurns = items.map((turn, index) => ({
      ...turn,
      turnnumber: index + 1
    }));

    queryClient.setQueryData(['turns', gameId], updatedTurns);

    try {
      // Update all turns in a single transaction
      const { error } = await supabase.rpc('update_turn_numbers', {
        turn_updates: updatedTurns.map(turn => ({
          turn_uuid: turn.uuid,
          new_number: turn.turnnumber
        }))
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Turn order updated successfully",
      });
    } catch (error: any) {
      // Revert the cache on error
      queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
      
      toast({
        title: "Error updating turn order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleDragEnd };
};