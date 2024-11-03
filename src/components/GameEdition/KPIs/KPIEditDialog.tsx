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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { FormulaInput } from "./FormulaEditor/FormulaInput";
import { useQuery } from "@tanstack/react-query";

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
  const [isCalculated, setIsCalculated] = useState(!!kpi.formula);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kpis } = useQuery({
    queryKey: ['kpis', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId);
      
      if (error) throw error;
      return data as KPI[];
    }
  });

  useEffect(() => {
    setFormData(kpi);
    setIsCalculated(!!kpi.formula);
  }, [kpi]);

  const handleSave = async () => {
    try {
      const dependsOn = isCalculated 
        ? formData.formula?.match(/kpi:([a-zA-Z0-9-]+)/g)?.map(match => match.replace('kpi:', '')) || []
        : null;

      const updatedData = {
        ...formData,
        formula: isCalculated ? formData.formula : null,
        depends_on: dependsOn,
        default_value: isCalculated ? null : formData.default_value,
      };

      const { error } = await supabase
        .from('kpis')
        .update(updatedData)
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit KPI</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Operating Profit"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2 bg-gray-50 p-4 rounded-lg">
            <div className="space-y-0.5">
              <Label>{isCalculated ? "Calculated KPI" : "Constant KPI"}</Label>
              <p className="text-sm text-gray-500">
                {isCalculated ? "This KPI is calculated using a formula" : "This KPI has a constant value"}
              </p>
            </div>
            <Switch
              checked={isCalculated}
              onCheckedChange={setIsCalculated}
            />
          </div>

          {isCalculated ? (
            <div className="space-y-2">
              <Label>Formula</Label>
              <FormulaInput
                value={formData.formula || ''}
                onChange={(value) => setFormData({ ...formData, formula: value })}
                availableKPIs={kpis || []}
                gameId={gameId}
                currentKpiId={kpi.uuid}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Default Value</Label>
              <Input
                type="number"
                value={formData.default_value || 0}
                onChange={(e) => setFormData({ ...formData, default_value: parseFloat(e.target.value) })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              value={formData.unit || ''}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="e.g., $, pts"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};