import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export const useGameMasterCheck = () => {
  const [isGamemaster, setIsGamemaster] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    const checkRole = async () => {
      try {
        if (!session?.user) {
          navigate('/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (!profile || profile.role !== 'gamemaster') {
          toast({
            title: "Access Denied",
            description: "Only gamemasters can access this page",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setIsGamemaster(true);
      } catch (error: any) {
        console.error('Error checking role:', error);
        toast({
          title: "Error",
          description: "Failed to verify gamemaster role",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    checkRole();
  }, [navigate, toast, session]);

  return isGamemaster;
};