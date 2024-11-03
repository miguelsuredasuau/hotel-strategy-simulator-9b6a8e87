import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useGameMasterCheck = () => {
  const [isGamemaster, setIsGamemaster] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'gamemaster') {
        toast({
          title: "Access Denied",
          description: "Only gamemasters can access this page",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      setIsGamemaster(true);
    };

    checkRole();
  }, [navigate, toast]);

  return isGamemaster;
};