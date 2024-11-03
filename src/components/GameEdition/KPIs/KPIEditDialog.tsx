import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { KPI } from "@/types/kpi";
import KPIFormFields from "./KPIFormFields";

interface KPIEditDialogProps {
  kpi: Partial<KPI> | null;
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KPIEditDialog = ({ kpi, gameId, open, onOpenChange }: KPIEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<KPI>>({
    impact_type: 'value',
    weight: 1,
    default_value: 0,
    axis: 'Y',
    category: 'operational',
    is_customizable: false,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (kpi) {
      setFormData(kpi);
    } else {
      setFormData({
        impact_type: 'value',
        weight: 1,
        default_value: 0,
        axis: 'Y',
        category: 'operational',
        is_customizable: false,
      });
    }
  }, [kpi]);

  const handleChange = (field: keyof KPI, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const kpiData = {
        ...formData,
        game_uuid: gameId,
        impact_type: 'value',
      };

      if (kpi?.uuid) {
        const { error } = await supabase
          .from('kpis')
          .update(kpiData)
          .eq('uuid', kpi.uuid);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('kpis')
          .insert([kpiData]);

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      onOpenChange(false);
      toast({
        title: "Success",
        description: `KPI ${kpi ? 'updated' : 'created'} successfully`,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{kpi?.uuid ? 'Edit' : 'Create'} KPI</DialogTitle>
        </DialogHeader>
        <KPIFormFields kpi={formData} onChange={handleChange} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {kpi?.uuid ? 'Update' : 'Create'} KPI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KPIEditDialog;