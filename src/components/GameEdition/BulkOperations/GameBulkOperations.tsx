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
      const { data: options } = await supabase
        .from('Options')
        .select('*, Turns(turnnumber)')
        .eq('game_uuid', gameId)
        .order('turn_uuid, optionnumber');

      if (!options || options.length === 0) {
        toast({
          title: "No options to export",
          description: "Create some options first before exporting.",
          variant: "destructive",
        });
        return;
      }

      const excelData = options.map(option => ({
        'Turn Number': option.Turns?.turnnumber || '',
        'Option Number': option.optionnumber,
        'Title': option.title || '',
        'Description': option.description || '',
        'Image URL': option.image || '',
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, 'Options');
      XLSX.writeFile(wb, `game_${gameId}_options.xlsx`);

      toast({
        title: "Success",
        description: "Options exported successfully",
      });
    } catch (error: any) {
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

      const { error } = await supabase.functions.invoke('bulk-upload-options', {
        body: formData,
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['options'] });
      toast({
        title: "Success",
        description: "Options uploaded successfully",
      });
      event.target.value = '';
    } catch (error: any) {
      toast({
        title: "Error uploading options",
        description: error.message,
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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