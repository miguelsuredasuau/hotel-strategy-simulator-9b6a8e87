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
          className="group"
        >
          <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-6">
                  <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-100">
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{option.title || 'Untitled Option'}</h3>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    <div className="grid grid-cols-3 gap-4">
                      {option.impactkpi1 && (
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="text-sm font-medium">{option.impactkpi1}</p>
                          <p className="text-blue-600">{option.impactkpi1amount}</p>
                        </div>
                      )}
                      {option.impactkpi2 && (
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-sm font-medium">{option.impactkpi2}</p>
                          <p className="text-green-600">{option.impactkpi2amount}</p>
                        </div>
                      )}
                      {option.impactkpi3 && (
                        <div className="bg-purple-50 p-2 rounded">
                          <p className="text-sm font-medium">{option.impactkpi3}</p>
                          <p className="text-purple-600">{option.impactkpi3amount}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default OptionCard;