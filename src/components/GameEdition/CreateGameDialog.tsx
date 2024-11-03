import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGameCreated: (gameId: string) => void;
}

const CreateGameDialog = ({ open, onOpenChange, onGameCreated }: CreateGameDialogProps) => {
  const [gameName, setGameName] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('Games')
        .insert([{ name: gameName }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game created successfully",
      });

      onGameCreated(data.uuid);
      onOpenChange(false);
      setGameName('');
    } catch (error: any) {
      toast({
        title: "Error creating game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="gameName">Game Name</Label>
            <Input
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!gameName.trim()}>
            Create Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameDialog;
