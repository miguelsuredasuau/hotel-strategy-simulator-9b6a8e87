import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Option, Turn } from "@/types/game";
import { useOptionsActions } from "./useOptionsActions";
import { OptionsHeader } from "./OptionsHeader";
import { OptionsList } from "./OptionsList";
import OptionEditDialog from "./OptionEditDialog";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { Loader2 } from "lucide-react";

const OptionsPage = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const navigate = useNavigate();
  const { gameId = '', turnId = '' } = useParams();
  const { handleDragEnd, handleDeleteOption } = useOptionsActions(turnId, gameId);

  // Validate UUID parameters
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  // Fetch turn data
  const { data: turnData, isLoading: turnLoading, error: turnError } = useQuery({
    queryKey: ['turn', turnId],
    queryFn: async () => {
      if (!isValidUUID(turnId)) {
        throw new Error('Invalid turn ID');
      }

      const { data, error } = await supabase
        .from('Turns')
        .select('*')
        .eq('uuid', turnId)
        .single();

      if (error) throw error;
      return data as Turn;
    },
    enabled: !!turnId && isValidUUID(turnId),
  });

  // Fetch options data
  const { data: options, isLoading: optionsLoading, error: optionsError } = useQuery({
    queryKey: ['options', turnId, gameId],
    queryFn: async () => {
      if (!isValidUUID(turnId) || !isValidUUID(gameId)) {
        throw new Error('Invalid turn or game ID');
      }

      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('turn_uuid', turnId)
        .eq('game_uuid', gameId)
        .order('optionnumber');

      if (error) throw error;
      return data as Option[];
    },
    enabled: !!turnId && !!gameId && isValidUUID(turnId) && isValidUUID(gameId),
  });

  // Handle invalid IDs
  if (!isValidUUID(gameId) || !isValidUUID(turnId)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-500">Invalid game or turn ID. Please check the URL.</p>
          <button
            onClick={() => navigate('/game-edition')}
            className="mt-4 text-blue-500 hover:underline"
          >
            Return to Game Selection
          </button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (turnLoading || optionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Handle errors
  if (turnError || optionsError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-500">Error loading data. Please try again later.</p>
          <button
            onClick={() => navigate('/game-edition')}
            className="mt-4 text-blue-500 hover:underline"
          >
            Return to Game Selection
          </button>
        </div>
      </div>
    );
  }

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
        isLoading={optionsLoading}
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