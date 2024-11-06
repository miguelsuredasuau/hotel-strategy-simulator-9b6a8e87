import { Badge } from "@/components/ui/badge";

interface KPITokenProps {
  name: string;
  dragHandleProps: any;
  innerRef: any;
  draggableProps: any;
}

export const KPIToken = ({ name, dragHandleProps, innerRef, draggableProps }: KPITokenProps) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <Badge
        variant="secondary"
        className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-grab active:cursor-grabbing"
      >
        {name}
      </Badge>
    </div>
  );
};