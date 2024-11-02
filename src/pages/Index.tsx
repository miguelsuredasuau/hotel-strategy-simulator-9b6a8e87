import { useState } from "react";
import Header from "../components/Header/Header";
import Dashboard from "../components/Dashboard";
import HotelCard from "../components/HotelCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const TOTAL_TURNS = 20;

const Index = () => {
  const [currentTurn, setCurrentTurn] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  const { data: options, isLoading: optionsLoading } = useQuery({
    queryKey: ['options', currentTurn],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('Turn', currentTurn)
        .order('OptionNumber');

      if (error) {
        toast({
          title: "Error loading options",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const { data: turnData, isLoading: turnLoading } = useQuery({
    queryKey: ['turn', currentTurn],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Turns')
        .select('*')
        .eq('id', currentTurn)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error loading turn data",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        toast({
          title: "Turn not found",
          description: `Turn ${currentTurn} data is not available`,
          variant: "destructive",
        });
        return null;
      }

      return data;
    },
  });

  const handleHotelSelect = (hotelId: string) => {
    setSelectedHotel(hotelId);
    setShowDashboard(true);
  };

  const handleNextTurn = () => {
    if (currentTurn < TOTAL_TURNS) {
      setCurrentTurn(prev => prev + 1);
    }
    setShowDashboard(false);
    setSelectedHotel(null);
  };

  const isLoading = optionsLoading || turnLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentTurn={currentTurn} totalTurns={TOTAL_TURNS}>
        <h1 className="text-2xl font-bold text-hotel-text">THE HOTEL GAME</h1>
      </Header>
      
      {!showDashboard ? (
        <div className="p-6">
          {turnData && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-hotel-text mb-2">
                Turn {currentTurn}: {turnData.Challenge}
              </h2>
              <p className="text-gray-600">{turnData.Description}</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : options && options.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {options.map((option) => (
                <HotelCard
                  key={option.id}
                  id={String(option.id)}
                  name={option.Title || ''}
                  description={option.Description || ''}
                  image={option.Image || `https://source.unsplash.com/800x600/?hotel,luxury&sig=${option.id}`}
                  onSelect={() => handleHotelSelect(String(option.id))}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No options available for this turn.</p>
            </div>
          )}
        </div>
      ) : (
        <Dashboard onNextTurn={handleNextTurn} />
      )}
    </div>
  );
};

export default Index;