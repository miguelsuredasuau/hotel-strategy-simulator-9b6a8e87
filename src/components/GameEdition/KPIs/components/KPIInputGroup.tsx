import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";

interface KPIInputGroupProps {
  index: number;
  kpiName?: string;
  kpiAmount?: number;
  gameId: string;
  onChange: (field: string, value: any) => void;
}

const KPIInputGroup = ({ 
  index, 
  kpiName, 
  kpiAmount, 
  gameId,
  onChange 
}: KPIInputGroupProps) => {
  const { data: kpis } = useQuery({
    queryKey: ['kpis', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId)
        .order('name');

      if (error) throw error;
      return data as KPI[];
    },
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{`KPI ${index}`}</Label>
        <Select 
          value={kpiName} 
          onValueChange={(value) => onChange(`impactkpi${index}`, value)}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select KPI" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {kpis?.map((kpi) => (
              <SelectItem key={kpi.uuid} value={kpi.uuid}>
                {kpi.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input
          type="number"
          value={kpiAmount || ''}
          onChange={(e) => onChange(`impactkpi${index}amount`, parseFloat(e.target.value))}
          placeholder="Impact amount"
          className="bg-white"
        />
      </div>
    </div>
  );
};

export default KPIInputGroup;