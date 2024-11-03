import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface KPIInputGroupProps {
  index: number;
  kpiName: string | undefined;
  kpiAmount: number | undefined;
  onChange: (field: string, value: string | number) => void;
}

const KPIInputGroup = ({ index, kpiName, kpiAmount, onChange }: KPIInputGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{`KPI ${index}`}</Label>
        <Input
          value={kpiName || ''}
          onChange={(e) => onChange(`impactkpi${index}`, e.target.value)}
          placeholder="KPI name"
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