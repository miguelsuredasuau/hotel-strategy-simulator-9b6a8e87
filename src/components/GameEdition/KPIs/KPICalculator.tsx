import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calculator, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { KPI } from "@/types/kpi";

interface KPICalculatorProps {
  gameId: string;
}

export const KPICalculator = ({ gameId }: KPICalculatorProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formula, setFormula] = useState("");
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

  const handleCreateCalculatedKPI = async () => {
    try {
      // Extract KPI dependencies from formula
      const dependsOn = formula.match(/kpi:(\w+)/g)?.map(match => match.replace('kpi:', '')) || [];

      const { error } = await supabase
        .from('kpis')
        .insert({
          game_uuid: gameId,
          name,
          type: 'financial',
          description,
          formula,
          depends_on: dependsOn
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "Calculated KPI created successfully",
      });

      // Reset form
      setName("");
      setDescription("");
      setFormula("");
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
          Create Calculated KPI
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
          <div className="space-y-2">
            <Label>Formula</Label>
            <Textarea
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g., kpi:revenue - kpi:costs"
            />
            <p className="text-sm text-muted-foreground">
              Available KPIs: {kpis?.map(k => k.name).join(', ')}
            </p>
            <p className="text-sm text-muted-foreground">
              Use format: kpi:kpi_name for references (e.g., kpi:revenue)
            </p>
          </div>
          <Button onClick={handleCreateCalculatedKPI} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Calculated KPI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};