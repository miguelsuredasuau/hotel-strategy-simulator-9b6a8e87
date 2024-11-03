import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/game";

interface OptionFormProps {
  formData: Partial<Option>;
  onChange: (data: Partial<Option>) => void;
}

const OptionForm = ({ formData, onChange }: OptionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            placeholder="Enter title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image || ''}
            onChange={(e) => onChange({ ...formData, image: e.target.value })}
            placeholder="Enter image URL"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          placeholder="Enter description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kpi1">KPI 1</Label>
          <Input
            id="kpi1"
            value={formData.impactkpi1 || ''}
            onChange={(e) => onChange({ ...formData, impactkpi1: e.target.value })}
            placeholder="KPI name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kpi1amount">Amount</Label>
          <Input
            id="kpi1amount"
            type="number"
            value={formData.impactkpi1amount || ''}
            onChange={(e) => onChange({ ...formData, impactkpi1amount: parseFloat(e.target.value) })}
            placeholder="Impact amount"
          />
        </div>
      </div>
    </div>
  );
};

export default OptionForm;