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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormulaInput } from "./FormulaEditor/FormulaInput";

interface KPICreateDialogProps {
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KPICreateDialog = ({ gameId, open, onOpenChange }: KPICreateDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [isPercentage, setIsPercentage] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [formula, setFormula] = useState("");
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [defaultValue, setDefaultValue] = useState<number>(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    try {
      const dependsOn = isCalculated 
        ? formula.match(/kpi:(\w+)/g)?.map(match => match.replace('kpi:', '')) || []
        : null;

      const { error } = await supabase
        .from('kpis')
        .insert({
          game_uuid: gameId,
          name,
          type: 'financial',
          description,
          unit,
          is_percentage: isPercentage,
          formula: isCalculated ? formula : null,
          depends_on: dependsOn,
          current_value: isCalculated ? null : currentValue,
          default_value: isCalculated ? null : defaultValue,
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "KPI created successfully",
      });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setUnit("");
    setIsPercentage(false);
    setIsCalculated(false);
    setFormula("");
    setCurrentValue(0);
    setDefaultValue(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New KPI</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter KPI name"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., $, %, pts"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this KPI"
            />
          </div>

          <div className="flex items-center justify-between space-x-2 bg-gray-50 p-4 rounded-lg">
            <div className="space-y-0.5">
              <Label>Calculated KPI</Label>
              <p className="text-sm text-gray-500">
                {isCalculated ? "This KPI will be calculated using a formula" : "This KPI will have a constant value"}
              </p>
            </div>
            <Switch
              checked={isCalculated}
              onCheckedChange={setIsCalculated}
            />
          </div>

          {isCalculated ? (
            <FormulaInput
              value={formula}
              onChange={setFormula}
              availableKPIs={[]}
              gameId={gameId}
            />
          ) : (
            <div className="space-y-2">
              <Label>Default Value</Label>
              <Input
                type="number"
                value={defaultValue}
                onChange={(e) => setDefaultValue(parseFloat(e.target.value))}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label>Is Percentage?</Label>
            <Switch
              checked={isPercentage}
              onCheckedChange={setIsPercentage}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create KPI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};