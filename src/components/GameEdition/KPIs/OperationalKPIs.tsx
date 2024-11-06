import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { KPIEditDialog } from "./KPIEditDialog";
import { useState } from "react";
import KPICard from "./KPICard";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

interface OperationalKPIsProps {
  gameId: string;
  calculatedValues: Record<string, number>;
  circularDependencies?: Record<string, boolean>;
}

export const OperationalKPIs = ({ gameId, calculatedValues, circularDependencies = {} }: OperationalKPIsProps) => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [kpiToDelete, setKpiToDelete] = useState<KPI | null>(null);
  const { toast } = useToast();
  
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

  const handleDeleteKPI = async () => {
    if (!kpiToDelete) return;

    const { error } = await supabase
      .from('kpis')
      .delete()
      .eq('uuid', kpiToDelete.uuid);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete KPI",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "KPI deleted successfully",
    });
    setKpiToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4" />
          Operational KPIs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="operational">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {kpis?.map((kpi, index) => (
                <Draggable 
                  key={kpi.uuid} 
                  draggableId={kpi.uuid} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <KPICard
                        kpi={kpi}
                        calculatedValue={calculatedValues[kpi.uuid]}
                        dragHandleProps={provided.dragHandleProps}
                        onClick={() => setSelectedKPI(kpi)}
                        onDelete={() => setKpiToDelete(kpi)}
                        hasCircularDependency={circularDependencies[kpi.uuid]}
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
      <DeleteConfirmDialog
        open={!!kpiToDelete}
        onOpenChange={(open) => !open && setKpiToDelete(null)}
        onConfirm={handleDeleteKPI}
      />
    </Card>
  );
};