import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TeamsList from './TeamsList';
import CreateTeamDialog from './CreateTeamDialog';

const TeamsSection = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Teams Management</CardTitle>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Team
        </Button>
      </CardHeader>
      <CardContent>
        <TeamsList teams={teams || []} isLoading={isLoading} />
        <CreateTeamDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />
      </CardContent>
    </Card>
  );
};

export default TeamsSection;