import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TeamLogo = () => {
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('team_id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        if (profileData?.team_id) {
          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('teamlogo, teamname')
            .eq('id', profileData.team_id)
            .single();

          if (teamError) {
            console.error('Error fetching team:', teamError);
            return;
          }

          if (teamData) {
            setTeamLogo(teamData.teamlogo);
            setTeamName(teamData.teamname);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load team information",
          variant: "destructive",
        });
      }
    };

    fetchTeamInfo();
  }, [toast]);

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <Avatar>
        <AvatarImage src={teamLogo || ''} alt={teamName || 'Team logo'} />
        <AvatarFallback>
          <Image className="w-4 h-4 text-gray-400" />
        </AvatarFallback>
      </Avatar>
      {teamName && <span className="text-sm font-medium">{teamName}</span>}
    </div>
  );
};

export default TeamLogo;