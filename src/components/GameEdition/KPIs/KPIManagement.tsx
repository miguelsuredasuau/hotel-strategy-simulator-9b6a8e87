import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropContext } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinancialKPIs } from "./FinancialKPIs";
import { OperationalKPIs } from "./OperationalKPIs";
import { KPICalculatorDialog } from "./KPICalculatorDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface KPIManagementProps {
  gameId: string;
}

export const KPIManagement = ({ gameId }: KPIManagementProps) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>KPI Management</CardTitle>
          <Button onClick={() => setIsCalculatorOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New KPI
          </Button>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid md:grid-cols-2 gap-6">
              <FinancialKPIs gameId={gameId} />
              <OperationalKPIs gameId={gameId} />
            </div>
          </DragDropContext>
        </CardContent>
      </Card>
      <KPICalculatorDialog 
        gameId={gameId}
        open={isCalculatorOpen}
        onOpenChange={setIsCalculatorOpen}
      />
    </div>
  );
};