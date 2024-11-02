import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface GameDetailsCardProps {
  gameId: number;
  gameName: string;
  inspirationalImage: string;
  setGameName: (name: string) => void;
  setInspirationalImage: (url: string) => void;
}

const GameDetailsCard = ({ 
  gameId,
  gameName, 
  inspirationalImage, 
  setGameName, 
  setInspirationalImage 
}: GameDetailsCardProps) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('Games')
        .update({ 
          name: gameName,
          inspirational_image: inspirationalImage 
        })
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game details updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error saving game details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gameName">Game Name</Label>
          <Input
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Enter game name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Inspirational Image URL</Label>
          <Input
            id="imageUrl"
            value={inspirationalImage}
            onChange={(e) => setInspirationalImage(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameDetailsCard;