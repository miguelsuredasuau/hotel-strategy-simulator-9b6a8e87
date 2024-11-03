import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload, Loader2 } from "lucide-react";
import * as XLSX from 'xlsx';
import { Turn } from "@/types/game";

interface BulkOptionsDialogProps {
  turnId: string;
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BulkOptionsDialog = ({ turnId, gameId, open, onOpenChange }: BulkOptionsDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch turn data to get UUID
  const { data: turnData } = useQuery({
    queryKey: ['turn', turnId],
    queryFn: async () => {
      if (!turnId) throw new Error('No turn ID provided');
      
      const { data, error } = await supabase
        .from('Turns')
        .select('*')
        .eq('uuid', turnId)
        .single();

      if (error) throw error;
      return data as Turn;
    },
    enabled: !!turnId
  });

  const handleDownload = async () => {
    try {
      const { data: options } = await supabase
        .from('Options')
        .select('*')
        .eq('turn_uuid', turnId)
        .eq('game_uuid', gameId)
        .order('optionnumber');

      if (!options || options.length === 0) {
        toast({
          title: "No options to export",
          description: "Create some options first before exporting.",
          variant: "destructive",
        });
        return;
      }

      const excelData = options.map(option => ({
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
      XLSX.writeFile(wb, `turn_${turnId}_options.xlsx`);

      toast({
        title: "Success",
        description: "Options exported successfully",
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

    if (!turnData?.uuid) {
      toast({
        title: "Error",
        description: "Turn data not found",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('turnId', turnData.uuid);
      formData.append('gameId', gameId);

      const { error } = await supabase.functions.invoke('bulk-upload-options', {
        body: formData,
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['options', turnId, gameId] });
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Options Management</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Download Options</Label>
            <Button 
              onClick={handleDownload} 
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Upload Options</Label>
            <div className="relative">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <Loader2 className="h-6 w-4 animate-spin" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload an Excel file with columns: Option Number, Title, Description, Image URL, KPI 1, KPI 1 Amount, KPI 2, KPI 2 Amount, KPI 3, KPI 3 Amount
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};