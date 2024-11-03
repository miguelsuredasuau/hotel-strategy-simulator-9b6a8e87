import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";

interface KPIEditDialogProps {
  kpi: KPI;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
}

export const KPIEditDialog = ({
  kpi,
  open,
  onOpenChange,
  gameId,
}: KPIEditDialogProps) => {
  const [formData, setFormData] = useState(kpi);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData(kpi);
  }, [kpi]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('kpis')
        .update(formData)
        .eq('uuid', kpi.uuid);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "KPI updated successfully",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit KPI</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Value</Label>
              <Input
                type="number"
                value={formData.current_value}
                onChange={(e) => setFormData({ ...formData, current_value: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Default Value</Label>
              <Input
                type="number"
                value={formData.default_value}
                onChange={(e) => setFormData({ ...formData, default_value: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              value={formData.unit || ''}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="e.g., $, %, pts"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Is Percentage?</Label>
            <Switch
              checked={formData.is_percentage}
              onCheckedChange={(checked) => setFormData({ ...formData, is_percentage: checked })}
            />
          </div>
          {formData.formula && (
            <div className="space-y-2">
              <Label>Formula</Label>
              <Textarea
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                placeholder="e.g., kpi:revenue - kpi:costs"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};