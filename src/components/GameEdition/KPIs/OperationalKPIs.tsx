import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2, GripHorizontal } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { KPIEditDialog } from "./KPIEditDialog";
import { useState } from "react";

interface OperationalKPIsProps {
  gameId: string;
}

export const OperationalKPIs = ({ gameId }: OperationalKPIsProps) => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);

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
        <Droppable droppableId="operational">
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
                      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab hover:text-blue-500"
                              >
                                <GripHorizontal className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-lg">{kpi.name}</h4>
                                {kpi.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {kpi.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {kpi.formula && (
                              <div className="mt-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                                Formula: {kpi.formula}
                              </div>
                            )}
                            <div className="mt-3 flex items-center gap-4">
                              <div className="text-2xl font-semibold">
                                {kpi.current_value}
                                {kpi.unit && (
                                  <span className="text-base ml-1">{kpi.unit}</span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Default: {kpi.default_value}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="p-2 border-t bg-muted/50 cursor-pointer hover:bg-muted transition-colors text-center text-sm text-muted-foreground"
                        onClick={() => setSelectedKPI(kpi)}
                      >
                        Click to edit
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