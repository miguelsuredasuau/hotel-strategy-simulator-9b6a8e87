import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/game";
import KPIInputGroup from "./KPIInputGroup";

interface OptionFormProps {
  option: Partial<Option>;
  onChange: (field: string, value: any) => void;
}

const OptionForm = ({ option, onChange }: OptionFormProps) => {
  const handleChange = (field: string, value: any) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={option.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter title"
          />
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={option.image || ''}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={option.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter description"
        />
      </div>

      <div className="space-y-4">
        <KPIInputGroup
          index={1}
          kpiName={option.impactkpi1}
          kpiAmount={option.impactkpi1amount}
          onChange={handleChange}
        />
        <KPIInputGroup
          index={2}
          kpiName={option.impactkpi2}
          kpiAmount={option.impactkpi2amount}
          onChange={handleChange}
        />
        <KPIInputGroup
          index={3}
          kpiName={option.impactkpi3}
          kpiAmount={option.impactkpi3amount}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default OptionForm;