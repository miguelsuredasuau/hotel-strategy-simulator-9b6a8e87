import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload, Loader2 } from "lucide-react";
import * as XLSX from 'xlsx';
import { Option } from "@/types/game";

interface GameBulkOperationsProps {
  gameId: string;
}

export const GameBulkOperations = ({ gameId }: GameBulkOperationsProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDownload = async () => {
    try {
      // Fetch all turns first to get turn numbers
      const { data: turns } = await supabase
        .from('Turns')
        .select('uuid, turnnumber')
        .eq('game_uuid', gameId)
        .order('turnnumber');

      if (!turns || turns.length === 0) {
        toast({
          title: "No turns found",
          description: "Create some turns first before exporting options.",
          variant: "destructive",
        });
        return;
      }

      // Fetch all options for each turn
      const allOptions = [];
      for (const turn of turns) {
        const { data: options } = await supabase
          .from('Options')
          .select('*')
          .eq('turn_uuid', turn.uuid)
          .eq('game_uuid', gameId)
          .order('optionnumber');

        if (options) {
          allOptions.push(...options.map(option => ({
            'Turn Number': turn.turnnumber,
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
          })));
        }
      }

      if (allOptions.length === 0) {
        toast({
          title: "No options to export",
          description: "Create some options first before exporting.",
          variant: "destructive",
        });
        return;
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(allOptions);
      XLSX.utils.book_append_sheet(wb, ws, 'Options');
      XLSX.writeFile(wb, `game_${gameId}_options.xlsx`);

      toast({
        title: "Success",
        description: `Exported ${allOptions.length} options successfully`,
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Error exporting options",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('gameId', gameId);

      const { data, error } = await supabase.functions.invoke('bulk-upload-options', {
        body: formData,
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['options'] });
      await queryClient.invalidateQueries({ queryKey: ['turns'] });
      
      toast({
        title: "Success",
        description: "Options uploaded successfully",
      });
      event.target.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error uploading options",
        description: error.message || 'Failed to upload file',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleDownload} 
        variant="outline"
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export All Options
      </Button>
      <div className="relative">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <Button 
          variant="outline"
          className="gap-2"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Import All Options
        </Button>
      </div>
    </div>
  );
};