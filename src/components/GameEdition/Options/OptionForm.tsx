import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/game";
import KPIInputGroup from "./KPIInputGroup";

interface OptionFormProps {
  option: Partial<Option>;
  availableKPIs: { uuid: string; name: string }[];
  onChange: (field: string, value: any) => void;
}

const OptionForm = ({ option, availableKPIs = [], onChange }: OptionFormProps) => {
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
        {[1, 2, 3].map((index) => (
          <KPIInputGroup
            key={index}
            index={index}
            kpiName={option[`impactkpi${index}` as keyof Option] as string}
            kpiAmount={option[`impactkpi${index}amount` as keyof Option] as number}
            availableKPIs={availableKPIs}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
};

export default OptionForm;