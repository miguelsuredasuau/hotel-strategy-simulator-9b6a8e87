import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KPI {
  uuid: string;
  name: string;
}

interface KPIAutocompleteProps {
  value: string;
  gameId: string;
  kpis?: KPI[];
  onChange: (value: string) => void;
  onKPICreate?: () => void;
}

export function KPIAutocomplete({ 
  value = '', 
  gameId, 
  kpis = [], 
  onChange,
  onKPICreate 
}: KPIAutocompleteProps) {
  const { toast } = useToast();
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const safeKpis = React.useMemo(() => {
    return kpis?.filter((kpi): kpi is KPI => 
      kpi !== null && 
      typeof kpi === 'object' && 
      typeof kpi.name === 'string' && 
      typeof kpi.uuid === 'string'
    ) ?? [];
  }, [kpis]);

  const handleCreateKPI = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('kpis')
        .insert([
          { 
            name,
            game_uuid: gameId,
            impact_type: 'value',
            weight: 1,
            default_value: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New KPI created successfully",
      });

      onChange(name);
      onKPICreate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleValueChange = async (newValue: string) => {
    const existingKPI = safeKpis.find(k => k.name === newValue);
    
    if (!existingKPI && newValue.trim()) {
      await handleCreateKPI(newValue.trim());
    }
    
    onChange(newValue);
    setInputValue(newValue);
  };

  return (
    <Select value={inputValue} onValueChange={handleValueChange}>
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Select or create KPI..." />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {safeKpis.map((kpi) => (
          <SelectItem key={kpi.uuid} value={kpi.name}>
            {kpi.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}