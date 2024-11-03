import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DefaultAmountsEditorProps {
  gameId: string;
}

export const DefaultAmountsEditor = ({ gameId }: DefaultAmountsEditorProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: kpis, isLoading } = useQuery({
    queryKey: ['kpis', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId)
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSave = async (kpiId: string, value: number) => {
    try {
      const { error } = await supabase
        .from('kpis')
        .update({ default_value: value })
        .eq('uuid', kpiId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "Default value updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return null;

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Default KPI Values</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {kpis?.map((kpi) => (
          <div key={kpi.uuid} className="flex items-center gap-4">
            <Label className="w-1/2">{kpi.name}</Label>
            <Input
              type="number"
              value={kpi.default_value}
              onChange={(e) => handleSave(kpi.uuid, parseFloat(e.target.value))}
              className="w-1/4"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};