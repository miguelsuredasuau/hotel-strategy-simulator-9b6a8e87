import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Team } from "@/types/game";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TeamCard from "./TeamCard";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface TeamsCardProps {
  teams: Team[];
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (team: Team) => void;
  onAddTeam: () => void;
}

const TeamsCard = ({ teams, onEditTeam, onDeleteTeam, onAddTeam }: TeamsCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !teams) return;

    const items = Array.from(teams);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    queryClient.setQueryData(['teams'], items);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Participating Teams</CardTitle>
        <Button onClick={onAddTeam}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Team
        </Button>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="teams">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {teams.map((team, index) => (
                  <TeamCard
                    key={team.uuid}
                    team={team}
                    index={index}
                    onEditTeam={onEditTeam}
                    onDeleteTeam={onDeleteTeam}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default TeamsCard;
