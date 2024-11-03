import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KPIInputGroupProps {
  index: number;
  kpiName: string | undefined;
  kpiAmount: number | undefined;
  availableKPIs: { uuid: string; name: string }[];
  onChange: (field: string, value: string | number) => void;
}

const KPIInputGroup = ({ 
  index, 
  kpiName, 
  kpiAmount, 
  availableKPIs = [],
  onChange 
}: KPIInputGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{`KPI ${index}`}</Label>
        <Select 
          value={kpiName || ''} 
          onValueChange={(value) => onChange(`impactkpi${index}`, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select KPI..." />
          </SelectTrigger>
          <SelectContent>
            {availableKPIs.map((kpi) => (
              <SelectItem key={kpi.uuid} value={kpi.name}>
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
        />
      </div>
    </div>
  );
};

export default KPIInputGroup;