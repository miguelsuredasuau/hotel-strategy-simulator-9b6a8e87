import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatisticsCards } from "./Dashboard/StatisticsCards";
import { ChartSection } from "./Dashboard/ChartSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Option } from "@/types/game";
import { Loader2 } from "lucide-react";

interface DashboardProps {
  onNextTurn: () => void;
  gameId: string;
  selectedOptionId?: string;
}

const Dashboard = ({ onNextTurn, gameId, selectedOptionId }: DashboardProps) => {
  const { data: selectedOption, isLoading } = useQuery({
    queryKey: ['option', selectedOptionId],
    queryFn: async () => {
      if (!selectedOptionId) return null;
      
      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('uuid', selectedOptionId)
        .single();

      if (error) throw error;
      return data as Option;
    },
    enabled: !!selectedOptionId
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
        {selectedOption && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-2">Selected Option: {selectedOption.title}</h2>
            <p className="text-gray-600">{selectedOption.description}</p>
          </div>
        )}

        <StatisticsCards />
        <ChartSection />

        <div className="flex justify-end mt-8">
          <Button 
            onClick={onNextTurn}
            className="bg-hotel-primary text-white hover:bg-hotel-primary/90"
          >
            Next Turn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;