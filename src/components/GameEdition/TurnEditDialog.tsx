import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Turn } from "@/types/game";

interface TurnEditDialogProps {
  turn: Turn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (turn: Turn) => void;
}

const TurnEditDialog = ({ turn, open, onOpenChange, onSave }: TurnEditDialogProps) => {
  const [editedTurn, setEditedTurn] = useState<Turn>(turn);

  useEffect(() => {
    setEditedTurn(turn);
  }, [turn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTurn);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Turn {turn.turnnumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="challenge">Challenge</Label>
            <Input
              id="challenge"
              value={editedTurn.challenge || ""}
              onChange={(e) =>
                setEditedTurn({ ...editedTurn, challenge: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedTurn.description || ""}
              onChange={(e) =>
                setEditedTurn({ ...editedTurn, description: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TurnEditDialog;