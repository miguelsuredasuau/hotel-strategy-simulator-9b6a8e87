import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CreateGameDialog from "./CreateGameDialog";
import DeleteGameDialog from "./DeleteGameDialog";
import GameDetailsCard from "./GameDetailsCard";
import GameEditionHeader from "./Layout/GameEditionHeader";

const GameSelectionPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: games = [], refetch } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Games")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleGameCreated = () => {
    refetch();
    setIsCreateDialogOpen(false);
  };

  const handleDeleteGame = async () => {
    if (!selectedGameId) return;

    try {
      // First delete all options associated with the game's turns
      const { error: optionsError } = await supabase
        .from('Options')
        .delete()
        .eq('game_uuid', selectedGameId);

      if (optionsError) throw optionsError;

      // Delete all turns associated with the game
      const { error: turnsError } = await supabase
        .from('Turns')
        .delete()
        .eq('game_uuid', selectedGameId);

      if (turnsError) throw turnsError;

      // Delete all game_teams associations
      const { error: gameTeamsError } = await supabase
        .from('game_teams')
        .delete()
        .eq('game_uuid', selectedGameId);

      if (gameTeamsError) throw gameTeamsError;

      // Finally delete the game itself
      const { error: gameError } = await supabase
        .from('Games')
        .delete()
        .eq('uuid', selectedGameId);

      if (gameError) throw gameError;

      await refetch();
      toast({
        title: "Success",
        description: "Game deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GameEditionHeader showBackButton={false} />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Games</h2>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Game
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameDetailsCard
              key={game.uuid}
              game={game}
              onGameClick={() => navigate(`/game-edition/${game.uuid}`)}
              onDeleteClick={() => setSelectedGameId(game.uuid)}
            />
          ))}
        </div>

        <CreateGameDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onGameCreated={handleGameCreated}
        />

        <DeleteGameDialog
          open={!!selectedGameId}
          onOpenChange={(open) => !open && setSelectedGameId(null)}
          onConfirm={handleDeleteGame}
        />
      </div>
    </div>
  );
};

export default GameSelectionPage;