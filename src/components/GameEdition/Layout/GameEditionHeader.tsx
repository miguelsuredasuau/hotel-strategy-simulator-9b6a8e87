import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useState } from "react";
import CSVUploadDialog from "../BulkUpload/CSVUploadDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';

interface GameEditionHeaderProps {
  gameId?: number;
  onLogout: () => void;
}

const GameEditionHeader = ({ gameId, onLogout }: GameEditionHeaderProps) => {
  const [isTurnsUploadOpen, setIsTurnsUploadOpen] = useState(false);
  const [isOptionsUploadOpen, setIsOptionsUploadOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDownloadOptions = () => {
    // Code for downloading options...
  };

  const handleUploadOptions = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Code for uploading options...
  };

  const handleLogout = async () => {
    try {
      queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const { data: options } = useQuery({
    queryKey: ['all-options', gameId],
    queryFn: async () => {
      const { data: turns } = await supabase
        .from('Turns')
        .select('uuid, turnnumber')
        .eq('game_uuid', gameId)
        .order('turnnumber');

      if (!turns) return [];

      const allOptions = [];
      for (const turn of turns) {
        const { data: turnOptions } = await supabase
          .from('Options')
          .select('*')
          .eq('turn_uuid', turn.uuid)
          .eq('game_uuid', gameId)
          .order('optionnumber');

        if (turnOptions) {
          allOptions.push(...turnOptions.map(option => ({
            ...option,
            turnNumber: turn.turnnumber
          })));
        }
      }
      return allOptions;
    },
    enabled: !!gameId
  });

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Game Edition Dashboard</h1>
      <div className="flex gap-4">
        {gameId && (
          <>
            <Button
              variant="outline"
              onClick={handleDownloadOptions}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Options
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleUploadOptions}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button 
                variant="outline"
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Options
              </Button>
            </div>
          </>
        )}
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default GameEditionHeader;
