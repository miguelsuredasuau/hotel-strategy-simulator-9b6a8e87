import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface KPITokenProps {
  name: string;
  dragHandleProps: any;
  innerRef: any;
  draggableProps: any;
  onDelete: () => void;
}

export const KPIToken = ({ name, dragHandleProps, innerRef, draggableProps, onDelete }: KPITokenProps) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="group relative"
    >
      <Badge
        variant="secondary"
        className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-grab active:cursor-grabbing pr-8"
      >
        {name}
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
      </Badge>
    </div>
  );
};