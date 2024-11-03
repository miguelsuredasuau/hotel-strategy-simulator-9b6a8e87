import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Option } from "@/types/game";
import OptionForm from "./OptionForm";

interface OptionEditDialogProps {
  option: Option | null;
  turnId: number;
  gameId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OptionEditDialog = ({ option, turnId, gameId, open, onOpenChange }: OptionEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<Option>>({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setFormData(option || {});
    }
  }, [option, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        turn: turnId,
        game: gameId,
      };

      if (!dataToSend.optionnumber) {
        const { data: existingOptions } = await supabase
          .from('Options')
          .select('optionnumber')
          .eq('turn', turnId)
          .eq('game', gameId)
          .order('optionnumber', { ascending: false })
          .limit(1);

        dataToSend.optionnumber = existingOptions && existingOptions.length > 0 
          ? (existingOptions[0].optionnumber || 0) + 1 
          : 1;
      }

      if (option?.id) {
        const { error } = await supabase
          .from('Options')
          .update(dataToSend)
          .eq('id', option.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Options')
          .insert([dataToSend]);

        if (error) throw error;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['options', turnId, gameId] }),
        queryClient.invalidateQueries({ queryKey: ['turn', turnId] })
      ]);
      
      onOpenChange(false);
      setFormData({});
      toast({
        title: "Success",
        description: `Option ${option ? 'updated' : 'created'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{option ? 'Edit' : 'Create'} Option</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <OptionForm formData={formData} onChange={setFormData} />
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OptionEditDialog;