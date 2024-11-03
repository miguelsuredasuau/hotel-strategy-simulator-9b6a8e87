import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, ChevronDown, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Option } from '@/types/game';
import OptionCard from './OptionCard';
import OptionEditDialog from './OptionEditDialog';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { useOptionsActions } from './useOptionsActions';

interface OptionsSectionProps {
  turnId: string;
  gameId: string;
}

export const OptionsSection = ({ turnId, gameId }: OptionsSectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const { options, isLoading } = useOptionsQuery(turnId, gameId);
  const { handleSaveOption, handleDeleteOption, handleDragEnd } = useOptionsActions(turnId, gameId);

  return (
    <Card className="mt-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger className="hover:opacity-75">
              {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </CollapsibleTrigger>
            <Settings2 className="h-5 w-5" />
            <CardTitle>Options Management</CardTitle>
          </div>
          <Button onClick={() => {
            setSelectedOption(null);
            setIsCreateDialogOpen(true);
          }} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Option
          </Button>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
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
                          <div key={i} className="h-20 bg-gray-100 rounded-lg" />
                        ))}
                      </div>
                    ) : options?.length ? (
                      options.map((option, index) => (
                        <OptionCard
                          key={option.uuid}
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
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <OptionEditDialog
        option={selectedOption || { uuid: '', optionnumber: options ? options.length + 1 : 1, game_uuid: gameId, turn_uuid: turnId }}
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedOption(null);
          }
        }}
        onSave={handleSaveOption}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => selectedOption && handleDeleteOption(selectedOption.uuid)}
      />
    </Card>
  );
};

const useOptionsQuery = (turnId: string, gameId: string) => {
  const { data: options, isLoading } = useQuery({
    queryKey: ['options', turnId, gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('turn_uuid', turnId)
        .eq('game_uuid', gameId)
        .order('optionnumber');

      if (error) throw error;
      return data as Option[];
    },
  });

  return { options, isLoading };
};

export default OptionsSection;
