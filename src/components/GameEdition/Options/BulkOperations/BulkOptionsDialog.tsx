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
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload, Loader2 } from "lucide-react";
import { useTurnData } from "./hooks/useTurnData";
import { downloadOptionsAsExcel } from "./utils/excelUtils";

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
  const { data: turnData, isLoading: isTurnLoading } = useTurnData(turnId, open);

  const handleDownload = async () => {
    if (!turnData?.uuid) {
      toast({
        title: "Error",
        description: "Turn data not available",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: options } = await supabase
        .from('Options')
        .select('*')
        .eq('turn_uuid', turnData.uuid)
        .eq('game_uuid', gameId)
        .order('optionnumber');

      if (!options) return;
      
      const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
        toast({
          title,
          description,
          variant,
        });
      };

      downloadOptionsAsExcel(
        options, 
        turnData.uuid, 
        gameId, 
        turnData.turnnumber || 0,
        showToast
      );
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
    if (!file || !turnData?.uuid) return;

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
              disabled={isTurnLoading || !turnData}
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
                disabled={isUploading || isTurnLoading || !turnData}
                className="cursor-pointer"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <Loader2 className="h-6 w-4 animate-spin" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload an Excel file with columns: Turn UUID, Game UUID, Turn Number, Option Number, Title, Description, Image URL, KPI 1, KPI 1 Amount, KPI 2, KPI 2 Amount, KPI 3, KPI 3 Amount
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