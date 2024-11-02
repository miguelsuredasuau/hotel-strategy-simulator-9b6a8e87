import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GameDetailsCardProps {
  gameName: string;
  inspirationalImage: string;
  setGameName: (name: string) => void;
  setInspirationalImage: (url: string) => void;
}

const GameDetailsCard = ({ gameName, inspirationalImage, setGameName, setInspirationalImage }: GameDetailsCardProps) => (
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
    </CardContent>
  </Card>
);

export default GameDetailsCard;