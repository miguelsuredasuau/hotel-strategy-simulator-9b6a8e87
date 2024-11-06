import { cn } from "@/lib/utils";

interface OperatorTokenProps {
  value: string;
  dragHandleProps: any;
  innerRef: any;
  draggableProps: any;
}

export const OperatorToken = ({ value, dragHandleProps, innerRef, draggableProps }: OperatorTokenProps) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <span
        className={cn(
          "px-2 py-1 rounded cursor-grab active:cursor-grabbing",
          "font-mono text-sm",
          "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        {value}
      </span>
    </div>
  );
};