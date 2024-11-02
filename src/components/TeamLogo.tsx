import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const TeamLogo = () => {
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // First check if profile exists, if not create it
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id);

        if (!existingProfile || existingProfile.length === 0) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ id: user.id });

          if (insertError) {
            console.error('Error creating profile:', insertError);
            return;
          }
        }

        // Now fetch the profile with team info
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