import { Calendar } from "lucide-react";
import TeamLogo from "./TeamLogo";

interface GameHeaderProps {
  currentTurn: number;
  totalTurns: number;
}

const GameHeader = ({ currentTurn, totalTurns }: GameHeaderProps) => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-hotel-text">THE HOTEL GAME</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-hotel-primary" />
          <div className="flex gap-1 items-center">
            {Array.from({ length: totalTurns }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i + 1 === currentTurn
                    ? "bg-hotel-primary text-white"
                    : i + 1 < currentTurn
                    ? "bg-hotel-accent text-hotel-primary"
                    : "bg-gray-100 text-hotel-muted"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <TeamLogo />
      </div>
    </header>
  );
};

export default GameHeader;