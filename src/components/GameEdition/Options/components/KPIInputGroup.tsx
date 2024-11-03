import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KPIAutocomplete } from "./KPIAutocomplete";
import { useKPIValueUpdates } from "../../KPIs/FinancialStatement/hooks/useKPIValueUpdates";

interface KPIInputGroupProps {
  index: number;
  kpiName: string | undefined;
  kpiAmount: number | undefined;
  availableKPIs: { uuid: string; name: string }[];
  gameId: string;
  onChange: (field: string, value: any) => void;
  onKPICreate?: () => void;
}

const KPIInputGroup = ({ 
  index, 
  kpiName, 
  kpiAmount, 
  availableKPIs,
  gameId,
  onChange,
  onKPICreate
}: KPIInputGroupProps) => {
  const { handleKPIValueChange } = useKPIValueUpdates(gameId);

  const handleAmountChange = async (value: number) => {
    // Update the local state
    onChange(`impactkpi${index}amount`, value);
    
    // Find the KPI UUID based on the name
    const kpi = availableKPIs.find(k => k.name === kpiName);
    if (kpi) {
      // Save to Supabase
      await handleKPIValueChange(kpi.uuid, value);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{`KPI ${index}`}</Label>
        <KPIAutocomplete
          value={kpiName || ''}
          gameId={gameId}
          kpis={availableKPIs}
          onChange={(value) => onChange(`impactkpi${index}`, value)}
          onKPICreate={onKPICreate}
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