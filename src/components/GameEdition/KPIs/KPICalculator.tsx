import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { KPI } from "@/types/kpi";
import { FormulaInput } from "./FormulaEditor/FormulaInput";
import { KPITypeToggle } from "./KPITypeToggle";

interface KPICalculatorProps {
  gameId: string;
  onSuccess?: () => void;
}

export const KPICalculator = ({ gameId, onSuccess }: KPICalculatorProps) => {
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");
  const [defaultValue, setDefaultValue] = useState<number>(0);
  const [unit, setUnit] = useState("");
  const [isCustomVariable, setIsCustomVariable] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
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

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Name is required");
      return false;
    }

    const isDuplicate = kpis?.some(kpi => 
      kpi.name.toLowerCase() === value.toLowerCase()
    );

    if (isDuplicate) {
      setNameError("A KPI with this name already exists");
      return false;
    }

    setNameError(null);
    return true;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    validateName(value);
  };

  const handleCreateKPI = async () => {
    try {
      if (!validateName(name)) {
        return;
      }

      if (isCustomVariable) {
        const { error } = await supabase
          .from('kpis')
          .insert({
            game_uuid: gameId,
            name,
            type: 'operational',
            default_value: Number(defaultValue),
            unit,
          });

        if (error) throw error;
      } else {
        const dependsOn = formula.match(/kpi:([a-zA-Z0-9-]+)/g)?.map(match => match.replace('kpi:', '')) || [];

        const { error } = await supabase
          .from('kpis')
          .insert({
            game_uuid: gameId,
            name,
            type: 'financial',
            formula,
            depends_on: dependsOn,
            default_value: null,
            unit,
          });

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "KPI created successfully",
      });

      setName("");
      setFormula("");
      setDefaultValue(0);
      setUnit("");
      setIsCustomVariable(false);
      setNameError(null);
      
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
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Operating Profit"
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && (
              <p className="text-sm text-red-500 mt-1">{nameError}</p>
            )}
          </div>

          <KPITypeToggle
            isCustomVariable={isCustomVariable}
            onChange={setIsCustomVariable}
          />

          {isCustomVariable ? (
            <div className="space-y-2">
              <Label>Default Value</Label>
              <Input
                type="text"
                value={defaultValue}
                onChange={(e) => setDefaultValue(Number(e.target.value))}
                placeholder="Enter text or number"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Formula</Label>
              <FormulaInput
                value={formula}
                onChange={setFormula}
                availableKPIs={kpis || []}
                gameId={gameId}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., $, pts"
            />
          </div>

          <Button 
            onClick={handleCreateKPI} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!!nameError}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create {isCustomVariable ? "Variable" : "KPI"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};