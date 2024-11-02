import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Option } from "@/types/game";
import OptionForm from "./OptionForm";

interface OptionsEditDialogProps {
  turnId: number;
  gameId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OptionsEditDialog = ({ turnId, gameId, open, onOpenChange }: OptionsEditDialogProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newOption, setNewOption] = useState<Partial<Option>>({});

  const { data: options, isLoading } = useQuery({
    queryKey: ['options', turnId, gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('turn', turnId)
        .eq('game', gameId)
        .order('optionnumber');

      if (error) throw error;
      return data as Option[];
    },
  });

  const handleAddOption = async () => {
    try {
      const optionNumber = options ? options.length + 1 : 1;
      const { error } = await supabase
        .from('Options')
        .insert({
          ...newOption,
          turn: turnId,
          game: gameId,
          optionnumber: optionNumber,
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['options', turnId, gameId] });
      setNewOption({});
      toast({
        title: "Success",
        description: "Option added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateOption = async (option: Option) => {
    try {
      const { error } = await supabase
        .from('Options')
        .update(option)
        .eq('id', option.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['options', turnId, gameId] });
      toast({
        title: "Success",
        description: "Option updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteOption = async (optionId: number) => {
    try {
      const { error } = await supabase
        .from('Options')
        .delete()
        .eq('id', optionId);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Options for Turn {turnId}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {options?.map((option) => (
                <div key={option.id} className="p-4 border rounded-lg">
                  <OptionForm
                    option={option}
                    onUpdate={handleUpdateOption}
                    onDelete={() => handleDeleteOption(option.id)}
                  />
                </div>
              ))}
              <div className="space-y-4 p-4 border rounded-lg border-dashed">
                <h3 className="font-medium">Add New Option</h3>
                <OptionForm
                  option={newOption as Option}
                  onUpdate={setNewOption}
                  showDelete={false}
                />
                <Button onClick={handleAddOption} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OptionsEditDialog;