import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Game } from "@/types/game";

const DashboardContent = () => {
  const { gameId } = useParams<{ gameId: string }>();

  const { data: game } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('uuid', gameId)
        .single();

      if (error) throw error;
      return data as Game;
    },
    enabled: !!gameId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{game?.description}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardContent;
