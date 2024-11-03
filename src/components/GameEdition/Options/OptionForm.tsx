import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/game";

interface OptionFormProps {
  option: Partial<Option>;
  gameId: string;
  onChange: (field: string, value: any) => void;
}

const OptionForm = ({ option, onChange }: OptionFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={option.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Enter title"
          />
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={option.image || ''}
            onChange={(e) => onChange('image', e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={option.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Enter description"
        />
      </div>
    </div>
  );
};

export default OptionForm;