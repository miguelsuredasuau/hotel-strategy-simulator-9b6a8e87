import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Team } from "@/types/game";

interface TeamCardProps {
  team: Team;
  index: number;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (team: Team) => void;
}

const TeamCard = ({ team, index, onEditTeam, onDeleteTeam }: TeamCardProps) => {
  return (
    <Draggable draggableId={`team-${team.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={team.teamlogo || "/default-team-logo.png"}
                      alt={team.teamname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{team.teamname}</h3>
                    <p className="text-sm text-gray-500">{team.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditTeam(team)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteTeam(team)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default TeamCard;