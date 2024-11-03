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

interface CSVUploadDialogProps {
  gameId: number;
  type: 'turns' | 'options';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CSVUploadDialog = ({ gameId, type, open, onOpenChange }: CSVUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('gameId', gameId.toString());
      formData.append('type', type);

      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('bulk-upload-csv', {
        body: formData,
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['turns', gameId] });
      await queryClient.invalidateQueries({ queryKey: ['options'] });
      
      toast({
        title: "Success",
        description: `${type === 'turns' ? 'Turns' : 'Options'} uploaded successfully`,
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload {type === 'turns' ? 'Turns' : 'Options'} CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="csvFile">Select CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>
          {type === 'turns' && (
            <p className="text-sm text-gray-500">
              CSV format: turnnumber,challenge,description
            </p>
          )}
          {type === 'options' && (
            <p className="text-sm text-gray-500">
              CSV format: turnnumber,title,description,image,impactkpi1,impactkpi1amount
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isLoading}>
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVUploadDialog;