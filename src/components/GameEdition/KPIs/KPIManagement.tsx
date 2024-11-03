import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinancialKPIs } from "./FinancialKPIs";
import { OperationalKPIs } from "./OperationalKPIs";
import { KPICalculator } from "./KPICalculator";

interface KPIManagementProps {
  gameId: string;
}

export const KPIManagement = ({ gameId }: KPIManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    try {
      const sourceType = result.source.droppableId;
      const destType = result.destination.droppableId;
      
      if (sourceType !== destType) {
        const { error } = await supabase
          .from('kpis')
          .update({ type: destType })
          .eq('uuid', result.draggableId);

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
        toast({
          title: "Success",
          description: "KPI type updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KPI Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid md:grid-cols-2 gap-6">
              <FinancialKPIs gameId={gameId} />
              <OperationalKPIs gameId={gameId} />
            </div>
          </DragDropContext>
          <div className="mt-6">
            <KPICalculator gameId={gameId} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};