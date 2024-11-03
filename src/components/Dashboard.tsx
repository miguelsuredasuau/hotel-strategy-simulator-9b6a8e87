import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { StatisticsCards } from "./Dashboard/StatisticsCards";
import { ChartSection } from "./Dashboard/ChartSection";
import { Button } from "@/components/ui/button";
import { Option } from "@/types/game";
import { Loader2 } from "lucide-react";

interface DashboardProps {
  onNextTurn: () => void;
  gameId: string;
  turnNumber: number;
  isCurrentTurn: boolean;
}

const Dashboard = ({ onNextTurn, gameId, turnNumber, isCurrentTurn }: DashboardProps) => {
  const { data: selectedOption, isLoading } = useQuery({
    queryKey: ['selected-option', gameId, turnNumber],
    queryFn: async () => {
      const { data: turn } = await supabase
        .from('Turns')
        .select('uuid')
        .eq('game_uuid', gameId)
        .eq('turnnumber', turnNumber)
        .single();

      if (!turn) return null;

      const { data: options, error } = await supabase
        .from('Options')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('turn_uuid', turn.uuid);

      if (error) throw error;

      return (options as Option[])[0];
    },
    enabled: !!gameId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex gap-6">
          {selectedOption && (
            <div className="flex-grow bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Selected Option: {selectedOption.title}</h2>
              <p className="text-gray-600">{selectedOption.description}</p>
            </div>
          )}
          
          {isCurrentTurn && (
            <div className="w-[10%] bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
              <Button 
                onClick={onNextTurn}
                className="bg-hotel-primary text-white hover:bg-hotel-primary/90 w-full"
              >
                Next Turn
              </Button>
            </div>
          )}
        </div>

        <StatisticsCards />
        <ChartSection />
      </div>
    </div>
  );
};

export default Dashboard;