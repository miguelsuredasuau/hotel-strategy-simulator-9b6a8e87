import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import CSVUploadDialog from "./BulkUpload/CSVUploadDialog";

interface GameEditionHeaderProps {
  gameId?: number;
  onLogout: () => void;
}

const GameEditionHeader = ({ gameId, onLogout }: GameEditionHeaderProps) => {
  const [isTurnsUploadOpen, setIsTurnsUploadOpen] = useState(false);
  const [isOptionsUploadOpen, setIsOptionsUploadOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Game Edition Dashboard</h1>
      <div className="flex gap-4">
        {gameId && (
          <>
            <Button
              variant="outline"
              onClick={() => setIsTurnsUploadOpen(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Turns
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOptionsUploadOpen(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Options
            </Button>
            <CSVUploadDialog
              gameId={gameId}
              type="turns"
              open={isTurnsUploadOpen}
              onOpenChange={setIsTurnsUploadOpen}
            />
            <CSVUploadDialog
              gameId={gameId}
              type="options"
              open={isOptionsUploadOpen}
              onOpenChange={setIsOptionsUploadOpen}
            />
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