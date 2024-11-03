import { useState, useEffect } from "react";
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
  option: Partial<Option> | null;
  turnId: number;
  gameId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OptionEditDialog = ({ option, turnId, gameId, open, onOpenChange }: OptionEditDialogProps) => {
  const [formData, setFormData] = useState<Omit<Option, 'id'>>({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (option) {
      const { id, ...rest } = option;
      setFormData(rest);
    } else {
      setFormData({});
    }
  }, [option]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        turn: turnId,
        game: gameId,
      };

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

      queryClient.invalidateQueries({ queryKey: ['options', turnId, gameId] });
      onOpenChange(false);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kpi1">KPI 1</Label>
              <Input
                id="kpi1"
                value={formData.impactkpi1 || ''}
                onChange={(e) => setFormData({ ...formData, impactkpi1: e.target.value })}
                placeholder="KPI name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kpi1amount">Amount</Label>
              <Input
                id="kpi1amount"
                type="number"
                value={formData.impactkpi1amount || ''}
                onChange={(e) => setFormData({ ...formData, impactkpi1amount: parseFloat(e.target.value) })}
                placeholder="Impact amount"
              />
            </div>
          </div>
          <DialogFooter>
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
