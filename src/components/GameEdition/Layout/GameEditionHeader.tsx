import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GameEditionHeaderProps } from "./types";

const GameEditionHeader = ({ showBackButton = true }: GameEditionHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {showBackButton && (
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Game Edition</h1>
          </div>
          <div className="flex items-center">
            {/* Right side content if needed */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameEditionHeader;
