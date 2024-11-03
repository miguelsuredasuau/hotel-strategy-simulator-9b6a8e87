import { Badge } from "@/components/ui/badge";

interface KPITokenProps {
  name: string;
  onDelete?: () => void;
  dragHandleProps: any;
  innerRef: any;
  draggableProps: any;
}

export const KPIToken = ({ name, onDelete, dragHandleProps, innerRef, draggableProps }: KPITokenProps) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <Badge
        variant="secondary"
        className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-grab active:cursor-grabbing group relative"
        onClick={onDelete}
      >
        {name}
        {onDelete && (
          <span className="absolute inset-0 flex items-center justify-center bg-blue-100/0 opacity-0 group-hover:opacity-100 transition-opacity">
            ×
          </span>
        )}
      </Badge>
    </div>
  );
};