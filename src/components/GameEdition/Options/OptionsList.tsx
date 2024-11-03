import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Option } from "@/types/game";
import OptionCard from "./OptionCard";

interface OptionsListProps {
  options?: Option[];
  isLoading: boolean;
  onEditOption: (option: Option) => void;
  onDeleteOption: (option: Option) => void;
  onDragEnd: (result: any) => void;
}

export const OptionsList = ({ 
  options, 
  isLoading, 
  onEditOption, 
  onDeleteOption, 
  onDragEnd 
}: OptionsListProps) => {
  return (
    <div className="mt-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="options">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 rounded-lg" />
                  ))}
                </div>
              ) : options?.length ? (
                options.map((option, index) => (
                  <OptionCard
                    key={option.uuid}
                    option={option}
                    index={index}
                    onEdit={() => onEditOption(option)}
                    onDelete={() => onDeleteOption(option)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No options created yet
                </p>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};