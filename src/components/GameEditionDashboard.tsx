import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import DashboardHeader from './GameEdition/Dashboard/DashboardHeader';
import { useGameData } from '@/hooks/useGameData';
import { useGameMasterCheck } from './GameEdition/Dashboard/useGameMasterCheck';
import TurnsSection from './GameEdition/TurnsManagement/TurnsSection';
import { GameBulkOperations } from './GameEdition/BulkOperations/GameBulkOperations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const GameEditionDashboard = () => {
  const { gameId = '' } = useParams();
  const navigate = useNavigate();
  const isGamemaster = useGameMasterCheck();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { gameData, isLoading } = useGameData(gameId);
  const [name, setName] = useState(gameData?.name || '');
  const [description, setDescription] = useState(gameData?.description || '');
  const [inspirationalImage, setInspirationalImage] = useState(gameData?.inspirational_image || '');
  const [hasChanges, setHasChanges] = useState(false);

  // Update state when gameData is loaded
  useEffect(() => {
    if (gameData) {
      setName(gameData.name || '');
      setDescription(gameData.description || '');
      setInspirationalImage(gameData.inspirational_image || '');
      setHasChanges(false);
    }
  }, [gameData]);

  // Check for changes
  useEffect(() => {
    if (gameData) {
      const changed = 
        name !== (gameData.name || '') ||
        description !== (gameData.description || '') ||
        inspirationalImage !== (gameData.inspirational_image || '');
      setHasChanges(changed);
    }
  }, [name, description, inspirationalImage, gameData]);

  const handleLogout = async () => {
    try {
      queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error signing out",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleSaveGame = async () => {
    try {
      const { error } = await supabase
        .from('Games')
        .update({
          name,
          description,
          inspirational_image: inspirationalImage
        })
        .eq('uuid', gameId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['game', gameId] });
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Game details updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isGamemaster) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <DashboardHeader onLogout={handleLogout} />
          <GameBulkOperations gameId={gameId} />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Game Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Game Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter game name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter game description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Inspirational Image URL</Label>
              <Input
                id="image"
                value={inspirationalImage}
                onChange={(e) => setInspirationalImage(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            <Button 
              onClick={handleSaveGame}
              disabled={!hasChanges}
              className={cn(
                "text-white",
                hasChanges ? "bg-hotel-primary hover:bg-hotel-primary/90" : "opacity-50 cursor-not-allowed"
              )}
            >
              Save Game Details
            </Button>
          </CardContent>
        </Card>

        <TurnsSection gameId={gameId} />
      </div>
    </div>
  );
};

export default GameEditionDashboard;