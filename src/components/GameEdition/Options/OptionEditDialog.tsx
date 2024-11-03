```typescript
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Option } from "@/types/game";
import OptionForm from "./OptionForm";

interface OptionEditDialogProps {
  option: Option | null;
  turnId: string;
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (option: Option) => Promise<void>;
}

const OptionEditDialog = ({
  option,
  turnId,
  gameId,
  open,
  onOpenChange,
  onSave
}: OptionEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<Option>>(option || {});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {option?.uuid ? 'Edit Option' : 'Create New Option'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <OptionForm
            formData={formData}
            onChange={setFormData}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {option?.uuid ? 'Save Changes' : 'Create Option'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OptionEditDialog;
```