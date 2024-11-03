import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DescriptionDialogProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DescriptionDialog = ({
  title,
  description,
  open,
  onOpenChange,
}: DescriptionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionDialog;