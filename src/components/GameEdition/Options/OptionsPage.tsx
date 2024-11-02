import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OptionCard from "./OptionCard";
import OptionEditDialog from "./OptionEditDialog";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { Option } from "@/types/game";
import { Card, CardContent } from "@/components/ui/card";

interface OptionsPageProps {
  turnId: number;
  gameId: number;
  turnNumber: number;
  turnChallenge?: string;
  turnDescription?: string;
  onBack: () => void;
}

const OptionsPage = ({ 
  turnId, 
  gameId, 
  turnNumber,
  turnChallenge,
  turnDescription,
  onBack 
}: OptionsPageProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: options, isLoading } = useQuery({
    queryKey: ['options', turnId, gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('turn', turnId)
        .eq('game', gameId)
        .order('optionnumber');

      if (error) throw error;
      return data as Option[];
    },
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !options) return;

    const items = Array.from(options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update option numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      optionnumber: index + 1
    }));

    // Update UI immediately
    queryClient.setQueryData(['options', turnId, gameId], updatedItems);

    // Update in database
    try {
      for (const option of updatedItems) {
        const { error } = await supabase
          .from('Options')
          .update({ optionnumber: option.optionnumber })
          .eq('id', option.id);
        
        if (error) throw error;
      }
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteOption = async (optionId: number) => {
    try {
      const { error } = await supabase
        .from('Options')
        .delete()
        .eq('id', optionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['options', turnId, gameId] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Option deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Turn {turnNumber} Options</h1>
        </div>

        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <h2 className="font-semibold text-xl mb-2">{turnChallenge}</h2>
            <p className="text-gray-600">{turnDescription}</p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => {
            setSelectedOption(null);
            setIsEditDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
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
                      key={option.id}
                      option={option}
                      index={index}
                      onEdit={(option) => {
                        setSelectedOption(option);
                        setIsEditDialogOpen(true);
                      }}
                      onDelete={(option) => {
                        setSelectedOption(option);
                        setIsDeleteDialogOpen(true);
                      }}
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

        <OptionEditDialog
          option={selectedOption}
          turnId={turnId}
          gameId={gameId}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() => selectedOption && handleDeleteOption(selectedOption.id)}
        />
      </div>
    </div>
  );
};

export default OptionsPage;