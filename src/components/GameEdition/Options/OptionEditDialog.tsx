import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Option } from "@/types/game";
import OptionForm from "./OptionForm";

interface OptionEditDialogProps {
  option: Partial<Option>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (option: Option) => Promise<void>;
}

const OptionEditDialog = ({
  option,
  open,
  onOpenChange,
  onSave,
}: OptionEditDialogProps) => {
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

    await onSave(formData as Option);
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