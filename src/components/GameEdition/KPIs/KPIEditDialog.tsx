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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface KPIEditDialogProps {
  kpi: any;
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KPIEditDialog = ({ kpi, gameId, open, onOpenChange }: KPIEditDialogProps) => {
  const [name, setName] = useState('');
  const [impactType, setImpactType] = useState('value');
  const [weight, setWeight] = useState('1');
  const [defaultValue, setDefaultValue] = useState('0');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (kpi) {
      setName(kpi.name || '');
      setImpactType(kpi.impact_type || 'value');
      setWeight(kpi.weight?.toString() || '1');
      setDefaultValue(kpi.default_value?.toString() || '0');
    } else {
      setName('');
      setImpactType('value');
      setWeight('1');
      setDefaultValue('0');
    }
  }, [kpi]);

  const handleSave = async () => {
    try {
      const kpiData = {
        name,
        impact_type: impactType,
        weight: parseFloat(weight),
        default_value: parseFloat(defaultValue),
        game_uuid: gameId,
      };

      if (kpi) {
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
          <DialogTitle>{kpi ? 'Edit' : 'Create'} KPI</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter KPI name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Impact Type</Label>
            <Select value={impactType} onValueChange={setImpactType}>
              <SelectTrigger>
                <SelectValue placeholder="Select impact type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">Value</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default">Default Value</Label>
            <Input
              id="default"
              type="number"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="Enter default value"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {kpi ? 'Update' : 'Create'} KPI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KPIEditDialog;