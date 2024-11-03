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
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Option } from "@/types/game";

interface OptionEditDialogProps {
  option: Option | null;
  turnId: string;
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OptionEditDialog = ({ option, turnId, gameId, open, onOpenChange }: OptionEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<Option>>({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        turn_uuid: turnId,
        game_uuid: gameId,
      };

      if (option?.uuid) {
        const { error } = await supabase
          .from('Options')
          .update(dataToSend)
          .eq('uuid', option.uuid);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Options')
          .insert([dataToSend]);

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['options', turnId, gameId] });
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{option ? 'Edit' : 'Create'} Option</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>
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