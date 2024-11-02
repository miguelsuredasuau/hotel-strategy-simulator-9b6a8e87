import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TeamLogo = () => {
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('team_id')
          .eq('id', user.id)
          .single();

        if (profileData?.team_id) {
          const { data: teamData } = await supabase
            .from('teams')
            .select('teamlogo, teamname')
            .eq('id', profileData.team_id)
            .single();

          if (teamData) {
            setTeamLogo(teamData.teamlogo);
            setTeamName(teamData.teamname);
          }
        }
      }
    };

    fetchTeamInfo();
  }, []);

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      {teamLogo ? (
        <img src={teamLogo} alt={teamName || 'Team logo'} className="w-8 h-8 rounded-full" />
      ) : (
        <Image className="w-8 h-8 text-gray-400" />
      )}
      {teamName && <span className="text-sm font-medium">{teamName}</span>}
    </div>
  );
};

export default TeamLogo;