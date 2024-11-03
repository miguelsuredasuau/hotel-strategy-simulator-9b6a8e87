import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CreateGameDialog from "./CreateGameDialog";
import DeleteGameDialog from "./DeleteGameDialog";
import GameDetailsCard from "./GameDetailsCard";
import Header from "../Header/Header";
import TeamMenu from "../Header/TeamMenu";

const GameSelectionPage = () => {
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [isDeleteGameOpen, setIsDeleteGameOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleGameClick = (gameId: string) => {
    navigate(`/game-edition/${gameId}`);
  };

  const handleDeleteClick = (gameId: string) => {
    setSelectedGameId(gameId);
    setIsDeleteGameOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header>
        <h1 className="text-2xl font-bold">Game Selection</h1>
      </Header>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Available Games</h2>
          <Button onClick={() => setIsCreateGameOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Game
          </Button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameDetailsCard
                key={game.uuid}
                game={game}
                onGameClick={() => handleGameClick(game.uuid)}
                onDeleteClick={() => handleDeleteClick(game.uuid)}
              />
            ))}
          </div>
        )}

        <CreateGameDialog
          open={isCreateGameOpen}
          onOpenChange={setIsCreateGameOpen}
        />

        {selectedGameId && (
          <DeleteGameDialog
            gameId={selectedGameId}
            open={isDeleteGameOpen}
            onOpenChange={setIsDeleteGameOpen}
          />
        )}
      </div>
    </div>
  );
};

export default GameSelectionPage;