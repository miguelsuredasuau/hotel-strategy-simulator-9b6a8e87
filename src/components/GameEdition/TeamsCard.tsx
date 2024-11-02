import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Team {
  id: number;
  teamname: string;
}

interface TeamsCardProps {
  teams: Team[];
}

const TeamsCard = ({ teams }: TeamsCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Participating Teams</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="flex items-center space-x-2">
            <Checkbox id={`team-${team.id}`} />
            <Label htmlFor={`team-${team.id}`}>{team.teamname}</Label>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default TeamsCard;