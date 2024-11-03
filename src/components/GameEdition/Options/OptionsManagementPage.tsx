import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Option, Turn } from "@/types/game";
import { OptionsHeader } from "./OptionsHeader";
import { OptionsSection } from "./OptionsSection";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
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
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/game-edition/${gameId}`)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Game
        </Button>
        <h1 className="text-2xl font-bold">
          Options for Turn {turnData?.turnnumber}
        </h1>
      </div>
      
      <OptionsSection 
        turnId={turnId}
        gameId={gameId}
      />
    </div>
  );
};

export default OptionsManagementPage;