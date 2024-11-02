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
import { useState } from "react";
import { Turn } from "@/types/game";

interface TurnEditDialogProps {
  turn: Turn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (turn: Turn) => void;
}

const TurnEditDialog = ({ turn, open, onOpenChange, onSave }: TurnEditDialogProps) => {
  const [editedTurn, setEditedTurn] = useState(turn);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Turn {turn.turnnumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedTurn)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TurnEditDialog;