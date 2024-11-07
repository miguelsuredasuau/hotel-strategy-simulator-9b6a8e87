import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Loader2 } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { KPIEditDialog } from "./KPIEditDialog";
import { useState } from "react";
import KPICard from "./KPICard";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

interface FinancialKPIsProps {
  gameId: string;
  calculatedValues: Record<string, number>;
  circularDependencies?: Record<string, boolean>;
}

export const FinancialKPIs = ({ gameId, calculatedValues, circularDependencies = {} }: FinancialKPIsProps) => {
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [kpiToDelete, setKpiToDelete] = useState<KPI | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['kpis', gameId, 'financial'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('type', 'financial')
        .order('order');

      if (error) throw error;
      return data as KPI[];
    },
    enabled: !!gameId,
  });

  const handleDeleteKPI = async () => {
    if (!kpiToDelete) return;

    try {
      // First, find all KPIs that depend on this one
      const { data: dependentKPIs } = await supabase
        .from('kpis')
        .select('*')
        .contains('depends_on', [kpiToDelete.uuid]);

      // Delete the dependent KPIs first
      if (dependentKPIs && dependentKPIs.length > 0) {
        const { error: dependentsError } = await supabase
          .from('kpis')
          .delete()
          .in('uuid', dependentKPIs.map(kpi => kpi.uuid));

        if (dependentsError) throw dependentsError;
      }

      // Then delete the KPI itself
      const { error } = await supabase
        .from('kpis')
        .delete()
        .eq('uuid', kpiToDelete.uuid);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "KPI and its dependencies deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setKpiToDelete(null);
    }
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
          <DollarSign className="h-4 w-4" />
          Financial KPIs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="financial">
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
                        gameId={gameId}
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
        title="Delete KPI?"
        description="This action cannot be undone. This will permanently delete this KPI and all KPIs that depend on it in their formulas."
      />
    </Card>
  );
};