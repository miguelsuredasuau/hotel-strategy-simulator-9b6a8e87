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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">KPI Management</h2>
        <Button 
          onClick={() => setIsCalculatorOpen(true)} 
          size="lg"
          className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="h-5 w-5" />
          Add New KPI
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-6">
          <FinancialKPIs gameId={gameId} />
          <OperationalKPIs gameId={gameId} />
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