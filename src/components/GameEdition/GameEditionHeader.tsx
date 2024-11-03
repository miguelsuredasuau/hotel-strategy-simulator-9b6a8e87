import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useState } from "react";
import CSVUploadDialog from "./BulkUpload/CSVUploadDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
    }
  };

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
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default GameEditionHeader;