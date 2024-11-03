import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Option, Turn } from "@/types/game";
import { Loader2 } from "lucide-react";
import HotelCard from "@/components/HotelCard";

interface TurnContentProps {
  gameId: string;
  currentTurn: number;
  onHotelSelect: () => void;
}

export const TurnContent = ({ gameId, currentTurn, onHotelSelect }: TurnContentProps) => {
  const { data: options, isLoading: optionsLoading } = useQuery({
    queryKey: ['options', gameId, currentTurn],
    queryFn: async () => {
      const { data: turn } = await supabase
        .from('Turns')
        .select('uuid')
        .eq('game_uuid', gameId)
        .eq('turnnumber', currentTurn)
        .single();

      if (!turn) return null;

      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('turn_uuid', turn.uuid)
        .order('optionnumber');

      if (error) throw error;
      return data as Option[];
    },
    enabled: !!gameId
  });

  const { data: turnData } = useQuery({
    queryKey: ['turn', gameId, currentTurn],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Turns')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('turnnumber', currentTurn)
        .single();

      if (error) throw error;
      return data as Turn;
    },
    enabled: !!gameId
  });

  if (optionsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-hotel-text mb-2">
          Turn {currentTurn}{turnData?.challenge ? `: ${turnData.challenge}` : ''}
        </h2>
        {turnData?.description && (
          <p className="text-gray-600">{turnData.description}</p>
        )}
      </div>

      {options && options.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {options.map((option) => (
            <HotelCard
              key={option.uuid}
              id={option.uuid}
              name={option.title || ''}
              description={option.description || ''}
              image={option.image || `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop`}
              onSelect={onHotelSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No options available for this turn.</p>
        </div>
      )}
    </div>
  );
};