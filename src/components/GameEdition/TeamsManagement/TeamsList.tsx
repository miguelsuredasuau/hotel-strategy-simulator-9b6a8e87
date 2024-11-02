import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Team {
  id: number;
  teamname: string;
  teamlogo?: string;
  email?: string;
}

interface TeamsListProps {
  teams: Team[];
  isLoading: boolean;
}

const TeamsList = ({ teams, isLoading }: TeamsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1 mx-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <div className="space-x-2">
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={team.teamlogo} alt={team.teamname} />
              <AvatarFallback>
                <Users className="h-6 w-6 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{team.teamname}</h3>
              {team.email && (
                <p className="text-sm text-gray-500">{team.email}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsList;