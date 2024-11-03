import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import KPIFormFields from "./KPIFormFields";

interface KPIEditDialogProps {
  kpi: KPI | null;
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KPIEditDialog = ({ kpi, gameId, open, onOpenChange }: KPIEditDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<KPI>>({
    name: kpi?.name || '',
    impact_type: kpi?.impact_type || 'value',
    weight: kpi?.weight || 1,
    default_value: kpi?.default_value || 0,
    axis: kpi?.axis || 'Y',
    category: kpi?.category || 'operational',
    game_uuid: gameId,
  });

  const handleSave = async () => {
    try {
      if (!formData.name) {
        throw new Error('Name is required');
      }

      const { data, error } = await supabase
        .from('kpis')
        .upsert({
          ...formData,
          uuid: kpi?.uuid,
          game_uuid: gameId,
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: `KPI ${kpi ? 'updated' : 'created'} successfully`,
      });
      onOpenChange(false);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{kpi ? 'Edit' : 'Create'} KPI</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <KPIFormFields
            kpi={formData}
            onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KPIEditDialog;