import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Turn } from '@/types/game';

export const useTurnManagement = (gameId: string) => {
  const [isNewTurnOpen, setIsNewTurnOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null);
  const [showingOptions, setShowingOptions] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCreateTurn = async (turn: any) => {
    try {
      const { data: turnsData } = await supabase
        .from('Turns')
        .select('*')
        .eq('game', gameId);

      const newTurnNumber = turnsData ? turnsData.length + 1 : 1;
      const { data, error } = await supabase
        .from('Turns')
        .insert({
          challenge: turn.challenge,
          description: turn.description,
          turnnumber: newTurnNumber,
          game: parseInt(gameId)
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
      setIsNewTurnOpen(false);
      toast({
        title: "Success",
        description: "Turn created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error creating turn",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    isNewTurnOpen,
    setIsNewTurnOpen,
    isOptionsOpen,
    setIsOptionsOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedTurn,
    setSelectedTurn,
    showingOptions,
    setShowingOptions,
    handleCreateTurn,
  };
};