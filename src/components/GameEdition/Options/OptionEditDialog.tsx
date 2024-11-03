import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Option } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";
import OptionForm from "./components/OptionForm";

interface OptionEditDialogProps {
  option: Partial<Option>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (option: Option) => Promise<void>;
  turnId?: string;
  gameId?: string;
}

const OptionEditDialog = ({
  option,
  open,
  onOpenChange,
  onSave,
  turnId,
  gameId,
}: OptionEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Option>>(option);

  useEffect(() => {
    setFormData(option);
  }, [option]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    const optionToSave = {
      ...formData,
      turn_uuid: turnId,
      game_uuid: gameId,
    } as Option;

    await onSave(optionToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {option.uuid ? 'Edit Option' : 'Create New Option'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <OptionForm
            option={formData}
            gameId={gameId || ''}
            onChange={handleChange}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {option.uuid ? 'Save Changes' : 'Create Option'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OptionEditDialog;