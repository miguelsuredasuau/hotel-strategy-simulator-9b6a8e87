import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Option } from "@/types/game";
import { DefaultAmountsEditor } from "./DefaultAmountsEditor";

interface OptionsEditDialogProps {
  turnId: string;
  gameId: string;
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
        .eq('turn_uuid', turnId)
        .eq('game_uuid', gameId)
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
          turn_uuid: turnId,
          game_uuid: gameId,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Options for Turn {turnId}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-8">
          <div className="w-1/2 space-y-6">
            <div className="space-y-4">
              {options?.map((option) => (
                <div key={option.uuid} className="p-4 border rounded-lg">
                  <div className="space-y-4">
                    <Input
                      value={option.title || ''}
                      onChange={(e) => setNewOption({ ...option, title: e.target.value })}
                      placeholder="Option title"
                    />
                    <Textarea
                      value={option.description || ''}
                      onChange={(e) => setNewOption({ ...option, description: e.target.value })}
                      placeholder="Option description"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border rounded-lg border-dashed">
              <div className="space-y-4">
                <Input
                  value={newOption.title || ''}
                  onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
                  placeholder="New option title"
                />
                <Textarea
                  value={newOption.description || ''}
                  onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                  placeholder="New option description"
                />
                <Button onClick={handleAddOption} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          </div>
          <DefaultAmountsEditor gameId={gameId} />
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