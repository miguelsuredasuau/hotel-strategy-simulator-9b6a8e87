import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Option } from "@/types/game";

interface OptionCardProps {
  option: Option;
  index: number;
  onEdit: (option: Option) => void;
  onDelete: (option: Option) => void;
}

const OptionCard = ({ option, index, onEdit, onDelete }: OptionCardProps) => {
  return (
    <Draggable draggableId={`option-${option.uuid}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-6">
                <div className="w-48 h-32 rounded-lg overflow-hidden">
                  <img
                    src={option.image || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
                    alt={option.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                      <p className="text-gray-600 mb-4">{option.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(option)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(option)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default OptionCard;