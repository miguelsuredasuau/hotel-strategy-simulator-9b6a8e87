import { Button } from "@/components/ui/button";

interface DashboardProps {
  onNextTurn: () => void;
  gameId: string;
}

const Dashboard = ({ onNextTurn }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
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