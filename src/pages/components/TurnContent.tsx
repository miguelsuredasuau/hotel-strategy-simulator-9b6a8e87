import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Option, Turn } from "@/types/game";
import { Loader2, DollarSign } from "lucide-react";
import HotelCard from "@/components/HotelCard";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TurnContentProps {
  gameId: string;
  currentTurn: number;
  onHotelSelect: () => void;
}

export const TurnContent = ({ gameId, currentTurn, onHotelSelect }: TurnContentProps) => {
  const [adr, setAdr] = useState<string>('');

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
    <div className="max-w-[1600px] mx-auto px-6 pt-6 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex gap-6 mb-6">
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-2xl font-bold text-hotel-text">
              Turn {currentTurn}
            </h2>
            {turnData?.challenge && (
              <h3 className="text-xl text-hotel-text/80">
                {turnData.challenge}
              </h3>
            )}
          </div>
          {turnData?.description && (
            <p className="text-gray-600">{turnData.description}</p>
          )}
        </div>

        <div className="w-[20%] shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Label 
              htmlFor="adr" 
              className="text-lg font-semibold text-hotel-primary flex items-center gap-2 mb-3"
            >
              <DollarSign className="h-5 w-5" />
              Average Daily Rate (ADR)
            </Label>
            <div className="relative">
              <Input
                id="adr"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter ADR..."
                value={adr}
                onChange={(e) => setAdr(e.target.value)}
                className="text-xl font-medium pl-8"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-6">
        {options && options.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {options.map((option) => (
              <HotelCard
                key={option.uuid}
                id={option.uuid}
                name={option.title || ''}
                description={option.description || ''}
                image={option.image || `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop`}
                onSelect={onHotelSelect}
                isDisabled={!adr}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No options available for this turn.</p>
          </div>
        )}
      </div>
    </div>
  );
};