import { Button } from "@/components/ui/button";
import TeamsSection from './GameEdition/TeamsManagement/TeamsSection';
import { StatisticsCards } from "./Dashboard/StatisticsCards";
import { ChartSection } from "./Dashboard/ChartSection";

interface DashboardProps {
  onNextTurn: () => void;
  gameId?: string;
}

const Dashboard = ({ onNextTurn, gameId }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {gameId && <TeamsSection gameId={gameId} />}
        <StatisticsCards />
        <ChartSection />
        <div className="flex justify-end mt-8">
          <Button 
            onClick={onNextTurn}
            className="bg-hotel-primary text-white hover:bg-hotel-primary/90"
          >
            Next Turn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;