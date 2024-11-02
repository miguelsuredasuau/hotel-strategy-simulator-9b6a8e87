import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface OptionsEditDialogProps {
  turnId: number;
  gameId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OptionsEditDialog = ({ turnId, gameId, open, onOpenChange }: OptionsEditDialogProps) => {
  const { data: options, isLoading } = useQuery({
    queryKey: ['options', turnId, gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('turn', turnId)
        .eq('game', gameId);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Options for Turn {turnId}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Options editing UI will be implemented in the next iteration */}
              <p className="text-center text-gray-500">
                Options editing functionality coming soon...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptionsEditDialog;