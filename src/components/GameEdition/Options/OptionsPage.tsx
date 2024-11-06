import { useParams, useNavigate } from "react-router-dom";
import { useGameMasterCheck } from "../Dashboard/useGameMasterCheck";
import OptionsSection from "./OptionsSection";
import GameEditionHeader from "../Layout/GameEditionHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { useState } from "react";

const OptionsPage = () => {
  const { gameId = "", turnId = "" } = useParams();
  const navigate = useNavigate();
  const isGamemaster = useGameMasterCheck();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

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

  const handleDownloadOptions = () => {
    if (!options || options.length === 0) {
      toast({
        title: "No options to export",
        description: "Create some options first before exporting.",
        variant: "destructive",
      });
      return;
    }

    const excelData = options.map(option => ({
      'Turn Number': option.turnNumber,
      'Option Number': option.optionnumber,
      'Title': option.title || '',
      'Description': option.description || '',
      'Image URL': option.image || '',
      'KPI 1': option.impactkpi1 || '',
      'KPI 1 Amount': option.impactkpi1amount || '',
      'KPI 2': option.impactkpi2 || '',
      'KPI 2 Amount': option.impactkpi2amount || '',
      'KPI 3': option.impactkpi3 || '',
      'KPI 3 Amount': option.impactkpi3amount || '',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Options');
    XLSX.writeFile(wb, 'game_options.xlsx');

    toast({
      title: "Success",
      description: "Options exported successfully",
    });
  };

  const handleUploadOptions = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('gameId', gameId?.toString() || '');
      formData.append('type', 'options');

      const { data, error } = await supabase.functions.invoke('bulk-upload-csv', {
        body: formData,
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['options'] });
      toast({
        title: "Success",
        description: "Options updated successfully from Excel file",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      event.target.value = '';
      setIsUploading(false);
    }
  };

  if (!isGamemaster) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GameEditionHeader gameId={gameId} />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/game-edition/${gameId}`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Game
          </Button>
          <div className="flex gap-4">
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
                disabled={isUploading}
              />
              <Button 
                variant="outline"
                className="gap-2"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                Import Options
              </Button>
            </div>
          </div>
        </div>
        <OptionsSection gameId={gameId} turnId={turnId} />
      </div>
    </div>
  );
};

export default OptionsPage;