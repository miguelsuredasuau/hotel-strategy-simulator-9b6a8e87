import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Trash2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GameDetailsCardProps {
  game: {
    uuid: string;
    name: string;
    description: string;
    inspirational_image: string;
    created_at: string;
    status: string;
  };
  onGameClick: () => void;
  onDeleteClick: () => void;
}

const GameDetailsCard = ({ game, onGameClick, onDeleteClick }: GameDetailsCardProps) => {
  const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick();
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
      onClick={onGameClick}
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
          {new Date(game.created_at).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDeleteClick}
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
  );
};

export default GameDetailsCard;