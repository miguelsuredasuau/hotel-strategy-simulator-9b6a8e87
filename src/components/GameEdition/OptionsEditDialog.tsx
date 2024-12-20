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
import { Plus, Loader2, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Option } from "@/types/game";
import KPIInputGroup from "./Options/components/KPIInputGroup";

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
      if (!turnId || !gameId) throw new Error('Turn ID and Game ID are required');
      
      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('turn_uuid', turnId)
        .eq('game_uuid', gameId)
        .order('optionnumber');

      if (error) throw error;
      return data as Option[];
    },
    enabled: !!turnId && !!gameId
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

  const handleDeleteOption = async (optionId: string) => {
    try {
      const { error } = await supabase
        .from('Options')
        .delete()
        .eq('uuid', optionId);

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
                <div key={option.uuid} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={option.title || ''}
                          onChange={(e) => setNewOption({ ...option, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={option.description || ''}
                          onChange={(e) => setNewOption({ ...option, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          value={option.image || ''}
                          onChange={(e) => setNewOption({ ...option, image: e.target.value })}
                        />
                      </div>
                      {/* KPI Input Groups */}
                      <KPIInputGroup
                        index={1}
                        kpiName={option.impactkpi1}
                        kpiAmount={option.impactkpi1amount}
                        gameId={gameId}
                        onChange={(field, value) => setNewOption({ ...option, [field]: value })}
                      />
                      {/* Repeat for other KPIs as needed */}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteOption(option.uuid)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="space-y-4 p-4 border rounded-lg border-dashed">
                <h3 className="font-medium">Add New Option</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newOption.title || ''}
                      onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newOption.description || ''}
                      onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddOption} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
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