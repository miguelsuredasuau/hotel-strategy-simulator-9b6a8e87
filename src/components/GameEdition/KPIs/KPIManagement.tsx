import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";
import { useToast } from "@/components/ui/use-toast";
import { useKPICalculations } from "./hooks/useKPICalculations";
import { KPICreateDialog } from "./KPICreateDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FinancialKPIs } from "./FinancialKPIs";
import { OperationalKPIs } from "./OperationalKPIs";
import { DragDropContext } from "@hello-pangea/dnd";

interface KPIManagementProps {
  gameId: string;
}

export const KPIManagement = ({ gameId }: KPIManagementProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const { data: kpis, isLoading } = useQuery({
    queryKey: ['kpis', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId)
        .order('order');

      if (error) throw error;
      return data as KPI[];
    },
    enabled: !!gameId,
  });

  const { calculateKPIValues } = useKPICalculations(gameId);
  const { values: calculatedValues, error, circularDependencies } = !isLoading && kpis ? calculateKPIValues(kpis) : { values: {}, error: null, circularDependencies: {} };

  useEffect(() => {
    if (error) {
      toast({
        title: "KPI Calculation Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !kpis) return;

    const sourceType = result.source.droppableId;
    const destinationType = result.destination.droppableId;

    if (sourceType !== destinationType) return; // Prevent dragging between different types

    const typeKpis = kpis.filter(kpi => kpi.type === sourceType);
    const [reorderedItem] = typeKpis.splice(result.source.index, 1);
    typeKpis.splice(result.destination.index, 0, reorderedItem);

    // Update order for all KPIs of this type
    const updates = typeKpis.map((kpi, index) => ({
      uuid: kpi.uuid,
      order: index,
    }));

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('kpis')
          .update({ order: update.order })
          .eq('uuid', update.uuid);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "KPI order updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating KPI order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">KPI Management</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add KPI
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FinancialKPIs
            gameId={gameId}
            calculatedValues={calculatedValues}
            circularDependencies={circularDependencies}
          />
          <OperationalKPIs
            gameId={gameId}
            calculatedValues={calculatedValues}
            circularDependencies={circularDependencies}
          />
        </div>

        <KPICreateDialog
          gameId={gameId}
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </DragDropContext>
  );
};