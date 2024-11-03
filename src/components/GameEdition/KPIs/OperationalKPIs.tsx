import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";

interface OperationalKPIsProps {
  gameId: string;
}

export const OperationalKPIs = ({ gameId }: OperationalKPIsProps) => {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['kpis', gameId, 'operational'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('type', 'operational')
        .order('name');

      if (error) throw error;
      return data as KPI[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Operational KPIs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {kpis?.map((kpi) => (
            <div key={kpi.uuid} className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium">{kpi.name}</h4>
                {kpi.description && (
                  <p className="text-sm text-muted-foreground">{kpi.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {kpi.current_value}
                  {kpi.unit && <span className="text-sm ml-1">{kpi.unit}</span>}
                </div>
                <div className="text-sm text-muted-foreground">
                  Default: {kpi.default_value}
                </div>
              </div>
            </div>
          ))}
          {(!kpis || kpis.length === 0) && (
            <p className="text-center text-muted-foreground py-4">
              No operational KPIs defined yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};