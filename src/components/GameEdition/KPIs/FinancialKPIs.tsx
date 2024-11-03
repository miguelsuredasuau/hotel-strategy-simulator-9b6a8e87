import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Loader2 } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { KPIEditDialog } from "./KPIEditDialog";
import { useState } from "react";
import KPICard from "./KPICard";

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
    <Card className="bg-white/50 backdrop-blur-sm">
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
                    >
                      <KPICard
                        kpi={kpi}
                        dragHandleProps={provided.dragHandleProps}
                        onClick={() => setSelectedKPI(kpi)}
                      />
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