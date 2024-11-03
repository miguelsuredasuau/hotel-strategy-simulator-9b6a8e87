import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image } from "lucide-react";

const TeamLogo = () => {
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('team_uuid')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        if (profileData?.team_uuid) {
          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('teamlogo, teamname')
            .eq('uuid', profileData.team_uuid)
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
      }
    };

    fetchTeamInfo();
  }, []);

  return (
    <Avatar>
      <AvatarImage src={teamLogo || ''} alt={teamName || 'Team logo'} />
      <AvatarFallback>
        <Image className="h-4 w-4 text-gray-400" />
      </AvatarFallback>
    </Avatar>
  );
};

export default TeamLogo;