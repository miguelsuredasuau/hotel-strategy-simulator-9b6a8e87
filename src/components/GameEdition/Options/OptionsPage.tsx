import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import OptionCard from "./OptionCard";
import OptionEditDialog from "./OptionEditDialog";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { Option, Turn } from "@/types/game";
import { useOptionsActions } from "./useOptionsActions";
import { OptionsHeader } from "./OptionsHeader";
import { OptionsList } from "./OptionsList";

const OptionsPage = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const navigate = useNavigate();
  const { gameId = '', turnId = '' } = useParams();
  const { handleDragEnd, handleDeleteOption } = useOptionsActions(turnId, gameId);

  // Fetch turn data
  const { data: turnData } = useQuery({
    queryKey: ['turn', turnId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Turns')
        .select('*')
        .eq('uuid', turnId)
        .single();
      if (error) throw error;
      return data as Turn;
    },
  });

  // Fetch options data
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

  return (
    <div className="container mx-auto py-8">
      <OptionsHeader 
        turnData={turnData}
        onBack={() => navigate(`/game-edition/${gameId}`)}
        onAddOption={() => {
          setSelectedOption(null);
          setIsEditDialogOpen(true);
        }}
      />

      <OptionsList
        options={options}
        isLoading={isLoading}
        onEditOption={(option) => {
          setSelectedOption(option);
          setIsEditDialogOpen(true);
        }}
        onDeleteOption={(option) => {
          setSelectedOption(option);
          setIsDeleteDialogOpen(true);
        }}
        onDragEnd={handleDragEnd}
      />

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
        onConfirm={() => selectedOption && handleDeleteOption(selectedOption.uuid)}
      />
    </div>
  );
};

export default OptionsPage;