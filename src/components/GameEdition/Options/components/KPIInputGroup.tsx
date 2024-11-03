import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KPICombobox } from "./KPICombobox";

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
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{`KPI ${index}`}</Label>
        <KPICombobox
          value={kpiName || ''}
          gameId={gameId}
          kpis={availableKPIs}
          onChange={(value) => onChange(`impactkpi${index}`, value)}
          onCreateNew={() => onKPICreate?.()}
        />
      </div>
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input
          type="number"
          value={kpiAmount || ''}
          onChange={(e) => onChange(`impactkpi${index}amount`, parseFloat(e.target.value))}
          placeholder="Impact amount"
        />
      </div>
    </div>
  );
};

export default KPIInputGroup;