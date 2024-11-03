import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Option } from "@/types/game";

export const useOptionsActions = (turnId: string, gameId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSaveOption = async (option: Option) => {
    try {
      if (!option.uuid) {
        const { error } = await supabase
          .from('Options')
          .insert([{
            ...option,
            game_uuid: gameId,
            turn_uuid: turnId,
            optionnumber: (await supabase
              .from('Options')
              .select('optionnumber')
              .eq('turn_uuid', turnId)
              .order('optionnumber', { ascending: false })
              .limit(1)
              .single()).data?.optionnumber + 1 || 1
          }]);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Options')
          .update(option)
          .eq('uuid', option.uuid);
        
        if (error) throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['options', turnId, gameId] });
      toast({
        title: "Success",
        description: `Option ${option.uuid ? 'updated' : 'created'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteOption = async (optionUuid: string) => {
    try {
      const { error } = await supabase
        .from('Options')
        .delete()
        .eq('uuid', optionUuid);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['options', turnId, gameId] });
      toast({
        title: "Success",
        description: "Option deleted successfully",
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

    const options = queryClient.getQueryData(['options', turnId, gameId]) as Option[];
    if (!options) return;

    const items = Array.from(options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedOptions = items.map((option, index) => ({
      ...option,
      optionnumber: index + 1
    }));

    try {
      for (const option of updatedOptions) {
        const { error } = await supabase
          .from('Options')
          .update({ optionnumber: option.optionnumber })
          .eq('uuid', option.uuid);
        
        if (error) throw error;
      }

      queryClient.setQueryData(['options', turnId, gameId], updatedOptions);
      toast({
        title: "Success",
        description: "Option order updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleDeleteOption, handleDragEnd, handleSaveOption };
};