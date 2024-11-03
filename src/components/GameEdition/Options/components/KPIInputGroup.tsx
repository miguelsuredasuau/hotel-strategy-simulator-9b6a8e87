import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KPICombobox } from "./KPICombobox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface KPIInputGroupProps {
  index: number;
  kpiName: string | undefined;
  kpiAmount: number | undefined;
  availableKPIs: { uuid: string; name: string }[];
  gameId: string;
  turnId?: string;
  onChange: (field: string, value: any) => void;
  onKPICreate?: () => void;
}

const KPIInputGroup = ({ 
  index, 
  kpiName, 
  kpiAmount, 
  availableKPIs,
  gameId,
  turnId,
  onChange,
  onKPICreate
}: KPIInputGroupProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAmountChange = async (value: number) => {
    onChange(`impactkpi${index}amount`, value);
    
    const kpi = availableKPIs.find(k => k.name === kpiName);
    if (!kpi) return;

    try {
      const { error } = await supabase
        .from('kpi_values')
        .upsert({
          kpi_uuid: kpi.uuid,
          game_uuid: gameId,
          turn_uuid: turnId,
          value: value
        }, {
          onConflict: 'kpi_uuid,game_uuid,turn_uuid'
        });

      if (error) throw error;

      await queryClient.invalidateQueries({ 
        queryKey: ['kpi-values', gameId, turnId] 
      });

      toast({
        title: "Success",
        description: "KPI value updated successfully",
      });
    } catch (error: any) {
      console.error('Error saving KPI value:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{`KPI ${index}`}</Label>
        <KPICombobox
          value={kpiName || ''}
          gameId={gameId}
          kpis={availableKPIs}
          onChange={(value) => onChange(`impactkpi${index}`, value)}
          onCreateNew={onKPICreate}
        />
      </div>
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input
          type="number"
          value={kpiAmount || ''}
          onChange={(e) => handleAmountChange(parseFloat(e.target.value))}
          placeholder="Impact amount"
        />
      </div>
    </div>
  );
};

export default KPIInputGroup;