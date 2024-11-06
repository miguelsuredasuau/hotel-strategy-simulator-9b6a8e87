import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hash } from "lucide-react";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onInsert: () => void;
}

export const NumberInput = ({ value, onChange, onInsert }: NumberInputProps) => {
  return (
    <div className="flex gap-2 mb-3">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onInsert();
          }
        }}
        placeholder="Enter a number..."
        className="w-40"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onInsert}
        className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700"
      >
        <Hash className="h-4 w-4" />
        Add Number
      </Button>
    </div>
  );
};