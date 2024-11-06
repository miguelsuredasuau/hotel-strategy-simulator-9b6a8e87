import { useState } from "react";
import { KPI } from "@/types/kpi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { KPIEditDialog } from "./KPIEditDialog";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

interface KPICardProps {
  kpi: KPI;
  calculatedValue?: number;
  hasCircularDependency?: boolean;
  gameId: string;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  onClick?: () => void;
  onDelete?: () => void;
}

export const KPICard = ({ 
  kpi, 
  calculatedValue, 
  hasCircularDependency, 
  gameId,
  dragHandleProps,
  onClick,
  onDelete 
}: KPICardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      // First, get all KPIs that might reference this one
      const { data: allKpis, error: fetchError } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId);

      if (fetchError) throw fetchError;

      // Update formulas in other KPIs to remove references to the deleted KPI
      for (const otherKpi of allKpis || []) {
        if (otherKpi.formula?.includes(`\${${kpi.uuid}}`)) {
          const updatedFormula = otherKpi.formula
            .replace(`\${${kpi.uuid}}`, '0')  // Replace KPI reference with 0
            .replace(/\s*[+\-*/]\s*0\s*(?=[+\-*/]|$)|0\s*[+\-*/]\s*/, ''); // Clean up operators

          const { error: updateError } = await supabase
            .from('kpis')
            .update({ 
              formula: updatedFormula,
              depends_on: (otherKpi.depends_on || []).filter(id => id !== kpi.uuid)
            })
            .eq('uuid', otherKpi.uuid);

          if (updateError) throw updateError;
        }
      }

      // Finally, delete the KPI
      const { error: deleteError } = await supabase
        .from('kpis')
        .delete()
        .eq('uuid', kpi.uuid);

      if (deleteError) throw deleteError;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "KPI deleted successfully",
      });
      
      if (onDelete) {
        onDelete();
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
    <Card>
      <CardContent className="pt-6" {...dragHandleProps}>
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 flex-1" onClick={onClick}>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{kpi.name}</h3>
              {hasCircularDependency && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {typeof calculatedValue === 'number' ? calculatedValue.toFixed(2) : 'N/A'}
              {kpi.unit ? ` ${kpi.unit}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>

      <KPIEditDialog
        kpi={kpi}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        gameId={gameId}
      />
    </Card>
  );
};