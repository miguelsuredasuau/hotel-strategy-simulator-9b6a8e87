import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";

interface TeamMenuProps {
  onLogout: () => void;
}

const TeamMenu = ({ onLogout }: TeamMenuProps) => {
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        if (!session?.user) return;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('team_uuid')
          .eq('id', session.user.id)
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
        toast({
          title: "Error",
          description: "Failed to load team information",
          variant: "destructive",
        });
      }
    };

    if (session) {
      fetchTeamInfo();
    }
  }, [session, toast]);

  const handleEditProfile = () => {
    navigate("/profile");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <Avatar>
            <AvatarImage src={teamLogo || ''} alt={teamName || 'Team logo'} />
            <AvatarFallback>
              <Image className="h-4 w-4 text-gray-400" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{teamName || 'Team Menu'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEditProfile}>
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamMenu;