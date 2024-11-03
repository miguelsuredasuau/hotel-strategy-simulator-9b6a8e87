import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KPICalculator } from "./KPICalculator";

interface KPICalculatorDialogProps {
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KPICalculatorDialog = ({ gameId, open, onOpenChange }: KPICalculatorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New KPI</DialogTitle>
        </DialogHeader>
        <KPICalculator gameId={gameId} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};