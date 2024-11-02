import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Turn {
  id: number;
  turnnumber: number;
  challenge?: string;
  description?: string;
}

interface TurnsCardProps {
  turns: Turn[];
}

const TurnsCard = ({ turns }: TurnsCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Game Turns</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {turns.map((turn) => (
          <Card key={turn.id}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label>Turn {turn.turnnumber}</Label>
                <Input
                  value={turn.challenge || ''}
                  onChange={(e) => {
                    // Update turn challenge logic here
                  }}
                  placeholder="Enter turn challenge"
                />
                <Input
                  value={turn.description || ''}
                  onChange={(e) => {
                    // Update turn description logic here
                  }}
                  placeholder="Enter turn description"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default TurnsCard;