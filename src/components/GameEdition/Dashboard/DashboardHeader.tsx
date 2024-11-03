import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onLogout: () => void;
}

const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/game-edition')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Games
        </Button>
        <h1 className="text-2xl font-bold">Game Edition Dashboard</h1>
      </div>
      <Button variant="outline" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
};

export default DashboardHeader;