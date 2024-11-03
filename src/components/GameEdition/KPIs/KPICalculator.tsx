import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calculator, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { KPI } from "@/types/kpi";
import { FormulaInput } from "./FormulaEditor/FormulaInput";

interface KPICalculatorProps {
  gameId: string;
  onSuccess?: () => void;
}

export const KPICalculator = ({ gameId, onSuccess }: KPICalculatorProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formula, setFormula] = useState("");
  const [isCalculated, setIsCalculated] = useState(false);
  const [defaultValue, setDefaultValue] = useState<number>(0);
  const [unit, setUnit] = useState("");
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

  const handleCreateKPI = async () => {
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
          formula: isCalculated ? formula : null,
          depends_on: dependsOn,
          default_value: isCalculated ? null : defaultValue,
          unit,
          is_percentage: false
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "KPI created successfully",
      });

      // Reset form
      setName("");
      setDescription("");
      setFormula("");
      setDefaultValue(0);
      setUnit("");
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Create New KPI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Operating Profit"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how this KPI is calculated"
            />
          </div>

          <div className="flex items-center justify-between space-x-2 bg-white border rounded-lg p-4">
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
            <div className="space-y-2">
              <Label>Formula</Label>
              <FormulaInput
                value={formula}
                onChange={setFormula}
                availableKPIs={kpis || []}
                gameId={gameId}
              />
            </div>
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

          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., $, %, pts"
            />
          </div>

          <Button 
            onClick={handleCreateKPI} 
            className="w-full bg-hotel-primary text-white hover:bg-hotel-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create KPI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};