import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Option } from "@/types/game";

interface OptionFormProps {
  option: Option;
  onUpdate: (option: Option) => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

const OptionForm = ({ option, onUpdate, onDelete, showDelete = true }: OptionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={option.title || ''}
              onChange={(e) => onUpdate({ ...option, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={option.description || ''}
              onChange={(e) => onUpdate({ ...option, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={option.image || ''}
              onChange={(e) => onUpdate({ ...option, image: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>KPI 1</Label>
              <Input
                value={option.impactkpi1 || ''}
                onChange={(e) => onUpdate({ ...option, impactkpi1: e.target.value })}
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={option.impactkpi1amount || ''}
                onChange={(e) => onUpdate({ ...option, impactkpi1amount: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>
        {showDelete && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default OptionForm;