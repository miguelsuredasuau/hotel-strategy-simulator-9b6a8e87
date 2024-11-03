interface TextTokenProps {
  value: string;
  onDelete?: () => void;
  dragHandleProps: any;
  innerRef: any;
  draggableProps: any;
}

export const TextToken = ({ value, onDelete, dragHandleProps, innerRef, draggableProps }: TextTokenProps) => {
  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <span 
        className="text-gray-600 cursor-grab active:cursor-grabbing hover:text-gray-900"
        onClick={onDelete}
      >
        {value.trim()}
      </span>
    </div>
  );
};