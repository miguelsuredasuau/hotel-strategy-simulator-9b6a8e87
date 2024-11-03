import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Loader2 } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { KPIEditDialog } from "./KPIEditDialog";
import { useState } from "react";

interface FinancialKPIsProps {
  gameId: string;
}

export const FinancialKPIs = ({ gameId }: FinancialKPIsProps) => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['kpis', gameId, 'financial'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('type', 'financial')
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
          <DollarSign className="h-5 w-5" />
          Financial KPIs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="financial">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {kpis?.map((kpi, index) => (
                <Draggable key={kpi.uuid} draggableId={kpi.uuid} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors"
                      onClick={() => setSelectedKPI(kpi)}
                    >
                      <div>
                        <h4 className="font-medium">{kpi.name}</h4>
                        {kpi.description && (
                          <p className="text-sm text-muted-foreground">{kpi.description}</p>
                        )}
                        {kpi.formula && (
                          <p className="text-sm text-muted-foreground">Formula: {kpi.formula}</p>
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
      {selectedKPI && (
        <KPIEditDialog
          kpi={selectedKPI}
          open={!!selectedKPI}
          onOpenChange={(open) => !open && setSelectedKPI(null)}
          gameId={gameId}
        />
      )}
    </Card>
  );
};