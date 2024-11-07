import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface OperatorTokenProps {
  value: string;
  dragHandleProps: any;
  innerRef: any;
  draggableProps: any;
  onDelete: () => void;
}

export const OperatorToken = ({ value, dragHandleProps, innerRef, draggableProps, onDelete }: OperatorTokenProps) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="group relative"
    >
      <span
        className={cn(
          "px-2 py-1 rounded cursor-grab active:cursor-grabbing pr-6",
          "font-mono text-sm",
          "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        {value}
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