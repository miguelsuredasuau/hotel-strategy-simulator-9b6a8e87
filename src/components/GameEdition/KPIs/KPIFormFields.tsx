import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { KPI, KPIAxis, KPICategory } from "@/types/kpi";

interface KPIFormFieldsProps {
  kpi: Partial<KPI>;
  onChange: (field: keyof KPI, value: any) => void;
}

const KPIFormFields = ({ kpi, onChange }: KPIFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={kpi.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter KPI name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Axis</Label>
          <Select
            value={kpi.axis || 'Y'}
            onValueChange={(value) => onChange('axis', value as KPIAxis)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select axis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="X">X (Financial)</SelectItem>
              <SelectItem value="Y">Y (Operational)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={kpi.category}
            onValueChange={(value) => onChange('category', value as KPICategory)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Weight</Label>
          <Input
            type="number"
            value={kpi.weight || 1}
            onChange={(e) => onChange('weight', parseFloat(e.target.value))}
            min={0}
            max={1}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <Label>Default Value</Label>
          <Input
            type="number"
            value={kpi.default_value || 0}
            onChange={(e) => onChange('default_value', parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={kpi.is_customizable || false}
          onCheckedChange={(checked) => onChange('is_customizable', checked)}
        />
        <Label>Customizable by players</Label>
      </div>
    </div>
  );
};

export default KPIFormFields;