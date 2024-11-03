import { cn } from "@/lib/utils";

interface OperatorTokenProps {
  value: string;
  onDelete?: () => void;
  dragHandleProps: any;
  innerRef: any;
  draggableProps: any;
}

export const OperatorToken = ({ value, onDelete, dragHandleProps, innerRef, draggableProps }: OperatorTokenProps) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <span
        className={cn(
          "px-2 py-1 rounded cursor-grab active:cursor-grabbing",
          "font-mono text-sm group relative",
          "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
        onClick={onDelete}
      >
        {value}
        {onDelete && (
          <span className="absolute inset-0 flex items-center justify-center bg-gray-200/0 opacity-0 group-hover:opacity-100 transition-opacity">
            ×
          </span>
        )}
      </span>
    </div>
  );
};