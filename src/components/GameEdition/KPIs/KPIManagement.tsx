import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DragDropContext } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinancialKPIs } from "./FinancialKPIs";
import { OperationalKPIs } from "./OperationalKPIs";
import { KPICalculatorDialog } from "./KPICalculatorDialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useKPICalculations } from "./hooks/useKPICalculations";

interface KPIManagementProps {
  gameId: string;
}

export const KPIManagement = ({ gameId }: KPIManagementProps) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kpis, isLoading } = useQuery({
    queryKey: ['kpis', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId);
      
      if (error) throw error;
      return data;
    },
  });

  const { calculateKPIValues } = useKPICalculations(kpis, gameId);
  const calculatedValues = calculateKPIValues();

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    try {
      const { error } = await supabase
        .from('kpis')
        .update({ type: result.destination.droppableId })
        .eq('uuid', result.draggableId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      
      toast({
        title: "Success",
        description: "KPI type updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRecalculate = async () => {
    try {
      const newValues = calculateKPIValues();
      await queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "KPIs recalculated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to recalculate KPIs",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">KPI Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleRecalculate}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Recalculate KPIs
          </Button>
          <Button 
            onClick={() => setIsCalculatorOpen(true)} 
            size="lg"
            className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-5 w-5" />
            Add New KPI
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-6">
          <FinancialKPIs gameId={gameId} calculatedValues={calculatedValues} />
          <OperationalKPIs gameId={gameId} calculatedValues={calculatedValues} />
        </div>
      </DragDropContext>

      <KPICalculatorDialog 
        gameId={gameId}
        open={isCalculatorOpen}
        onOpenChange={setIsCalculatorOpen}
      />
    </div>
  );
};