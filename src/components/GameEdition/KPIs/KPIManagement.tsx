import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useKPICalculations } from "./hooks/useKPICalculations";
import { KPICreateDialog } from "./KPICreateDialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { FinancialKPIs } from "./FinancialKPIs";
import { OperationalKPIs } from "./OperationalKPIs";
import { DragDropContext } from "@hello-pangea/dnd";
import { useDebounce } from './hooks/useDebounce';

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
      return data;
    },
    enabled: !!gameId,
  });

  const { calculateKPIValues } = useKPICalculations(gameId);
  const [calculationResult, setCalculationResult] = useState<{
    values: Record<string, number>;
    error: string | null;
    circularDependencies: Record<string, boolean>;
  }>({ values: {}, error: null, circularDependencies: {} });

  const recalculateValues = () => {
    if (!isLoading && kpis) {
      // Cancel any pending automatic recalculation
      cancelDebounce();
      
      const result = calculateKPIValues(kpis);
      setCalculationResult(result);
      toast({
        title: "KPIs Recalculated",
        description: "All KPI values have been updated.",
      });
    }
  };

  const { debouncedCallback: debouncedCalculation, cancelDebounce } = useDebounce(() => {
    if (!isLoading && kpis) {
      const result = calculateKPIValues(kpis);
      setCalculationResult(result);
    }
  }, 3500);

  // Trigger recalculation when KPIs change
  useEffect(() => {
    if (kpis) {
      debouncedCalculation();
    }
  }, [kpis, debouncedCalculation]);

  // Show error toast if calculation has errors
  useEffect(() => {
    if (calculationResult.error) {
      toast({
        title: "KPI Calculation Error",
        description: calculationResult.error,
        variant: "destructive",
      });
    }
  }, [calculationResult.error, toast]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !kpis) return;

    const sourceType = result.source.droppableId;
    const destinationType = result.destination.droppableId;

    if (sourceType !== destinationType) return;

    const typeKpis = kpis.filter(kpi => kpi.type === sourceType);
    const [reorderedItem] = typeKpis.splice(result.source.index, 1);
    typeKpis.splice(result.destination.index, 0, reorderedItem);

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
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={recalculateValues}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Recalculate
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add KPI
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FinancialKPIs
            gameId={gameId}
            calculatedValues={calculationResult.values}
            circularDependencies={calculationResult.circularDependencies}
          />
          <OperationalKPIs
            gameId={gameId}
            calculatedValues={calculationResult.values}
            circularDependencies={calculationResult.circularDependencies}
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