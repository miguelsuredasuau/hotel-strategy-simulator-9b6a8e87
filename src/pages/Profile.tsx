import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          toast({
            title: "Error fetching profile",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        setProfile(data);
      }
    };

    fetchProfile();
  }, [toast]);

  const { data: team } = useQuery({
    queryKey: ['team', profile?.team_uuid],
    queryFn: async () => {
      if (!profile?.team_uuid) return null;
      
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('uuid', profile.team_uuid)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.team_uuid
  });

  return (
    <div>
      <h1>Profile</h1>
      {profile && (
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
          {team && (
            <div>
              <h3>Team: {team.teamname}</h3>
              {team.teamlogo && <img src={team.teamlogo} alt={team.teamname} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
