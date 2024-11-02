import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const GameEditionDashboard = () => {
  const [gameName, setGameName] = useState('');
  const [inspirationalImage, setInspirationalImage] = useState('');
  const [teams, setTeams] = useState([]);
  const [turns, setTurns] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch teams and turns from Supabase
    const fetchTeamsAndTurns = async () => {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*');

      if (teamsError) {
        toast({
          title: "Error fetching teams",
          description: teamsError.message,
          variant: "destructive",
        });
        return;
      }

      const { data: turnsData, error: turnsError } = await supabase
        .from('Turns')
        .select('*');

      if (turnsError) {
        toast({
          title: "Error fetching turns",
          description: turnsError.message,
          variant: "destructive",
        });
        return;
      }

      setTeams(teamsData);
      setTurns(turnsData);
    };

    fetchTeamsAndTurns();
  }, [toast]);

  const handleSaveGame = async () => {
    // Logic to save game details
    // This will include saving game name, image, and turns
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Game Edition Dashboard</h1>
      <div className="mt-4">
        <label className="block">Game Name</label>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block">Inspirational Image URL</label>
        <input
          type="text"
          value={inspirationalImage}
          onChange={(e) => setInspirationalImage(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="mt-4">
        <h2 className="text-xl">Participating Teams</h2>
        {teams.map((team) => (
          <div key={team.id} className="flex items-center">
            <input type="checkbox" id={`team-${team.id}`} />
            <label htmlFor={`team-${team.id}`} className="ml-2">{team.teamname}</label>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-xl">Turns</h2>
        {turns.map((turn) => (
          <div key={turn.id} className="mt-2">
            <h3>{turn.challenge}</h3>
            {/* Add options editor here */}
          </div>
        ))}
      </div>
      <Button onClick={handleSaveGame} className="mt-4">Save Game</Button>
    </div>
  );
};

export default GameEditionDashboard;