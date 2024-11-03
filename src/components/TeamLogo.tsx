import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

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

        if (profileError) throw profileError;

        if (profileData?.team_uuid) {
          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('teamlogo, teamname')
            .eq('uuid', profileData.team_uuid)
            .single();

          if (teamError) throw teamError;

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
    <Avatar className="h-10 w-10">
      <AvatarImage 
        src={teamLogo || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04'} 
        alt={teamName || 'Team logo'} 
      />
      <AvatarFallback>
        <Users className="h-4 w-4 text-gray-400" />
      </AvatarFallback>
    </Avatar>
  );
};

export default TeamLogo;