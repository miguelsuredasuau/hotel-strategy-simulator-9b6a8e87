import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TextTokenProps {
  value: string;
  dragHandleProps: any;
  innerRef: any;
  draggableProps: any;
  onDelete: () => void;
}

export const TextToken = ({ value, dragHandleProps, innerRef, draggableProps, onDelete }: TextTokenProps) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="group relative"
    >
      <span className="text-gray-600 cursor-grab active:cursor-grabbing hover:text-gray-900 pr-6">
        {value.trim()}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-1 opacity-0 group-hover:opacity-100 hover:bg-transparent hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </span>
    </div>
  );
};