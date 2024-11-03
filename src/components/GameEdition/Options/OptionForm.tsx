import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/game";
import { useQueryClient } from "@tanstack/react-query";
import KPIInputGroup from "./components/KPIInputGroup";
import { useGameKPIs } from "./hooks/useGameKPIs";

interface OptionFormProps {
  option: Partial<Option>;
  gameId: string;
  turnId?: string;
  onChange: (field: string, value: any) => void;
}

const OptionForm = ({ option, gameId, turnId, onChange }: OptionFormProps) => {
  const queryClient = useQueryClient();
  const { data: kpis = [] } = useGameKPIs(gameId);

  const handleKPICreate = () => {
    queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
  };

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

      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <KPIInputGroup
            key={index}
            index={index}
            kpiName={option[`impactkpi${index}` as keyof Option] as string}
            kpiAmount={option[`impactkpi${index}amount` as keyof Option] as number}
            availableKPIs={kpis}
            gameId={gameId}
            turnId={turnId}
            onChange={onChange}
            onKPICreate={handleKPICreate}
          />
        ))}
      </div>
    </div>
  );
};

export default OptionForm;