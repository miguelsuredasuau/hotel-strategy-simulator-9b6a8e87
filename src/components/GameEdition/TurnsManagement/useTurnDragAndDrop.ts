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

    const items = Array.from(turns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the turn numbers
    const updatedTurns = items.map((turn, index) => ({
      ...turn,
      turnnumber: index + 1
    }));

    // Optimistically update the cache
    queryClient.setQueryData(['turns', gameId], updatedTurns);

    try {
      // Update each turn's number in the database
      const promises = updatedTurns.map(turn => 
        supabase
          .from('Turns')
          .update({ turnnumber: turn.turnnumber })
          .eq('uuid', turn.uuid)
      );

      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        throw new Error('Failed to update turn order');
      }

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