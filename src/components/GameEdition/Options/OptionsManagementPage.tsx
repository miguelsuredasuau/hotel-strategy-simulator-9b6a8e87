import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Option, Turn } from "@/types/game";
import { OptionsHeader } from "./OptionsHeader";
import { OptionsSection } from "./OptionsSection";
import { Loader2 } from "lucide-react";

const OptionsManagementPage = () => {
  const navigate = useNavigate();
  const { gameId = '', turnId = '' } = useParams();

  // Fetch turn data
  const { data: turnData, isLoading: turnLoading } = useQuery({
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
    enabled: !!turnId
  });

  if (turnLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <OptionsHeader 
        turnData={turnData}
        onBack={() => navigate(`/game-edition/${gameId}`)}
      />
      <OptionsSection 
        turnId={turnId}
        gameId={gameId}
      />
    </div>
  );
};

export default OptionsManagementPage;