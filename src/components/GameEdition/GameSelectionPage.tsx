import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CreateGameDialog from './CreateGameDialog';
import DeleteGameDialog from './DeleteGameDialog';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import TeamsSection from './TeamsManagement/TeamsSection';

const GameSelectionPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: games, isLoading } = useQuery({
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

  const handleGameSelect = (gameId: number) => {
    navigate(`/game-edition/${gameId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, gameId: number) => {
    e.stopPropagation();
    setSelectedGameId(gameId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteGame = async () => {
    if (!selectedGameId) return;

    try {
      const { error } = await supabase
        .from('Games')
        .delete()
        .eq('id', selectedGameId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['games'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Game deleted",
        description: "The game has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Game Selection</h1>
            <p className="text-gray-500 mt-2">Select a game to edit or create a new one</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Game
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-48" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games?.map((game) => (
              <Card 
                key={game.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={game.inspirational_image || defaultImage}
                      alt={game.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardHeader className="relative z-10 -mt-20 pb-4">
                  <CardTitle className="text-white text-2xl font-bold">
                    {game.name || 'Untitled Game'}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between items-center p-4 bg-white">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(game.created_at!).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDeleteClick(e, game.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      Edit Game
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <TeamsSection />

        <CreateGameDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
          onGameCreated={(gameId) => {
            navigate(`/game-edition/${gameId}`);
          }}
        />

        <DeleteGameDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteGame}
        />
      </div>
    </div>
  );
};

export default GameSelectionPage;