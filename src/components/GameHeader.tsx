import { Calendar } from "lucide-react";
import TeamLogo from "./TeamLogo";
import { cn } from "@/lib/utils";

interface GameHeaderProps {
  currentTurn: number;
  totalTurns: number;
  onTurnClick: (turnNumber: number) => void;
  latestTurn: number;
}

const GameHeader = ({ currentTurn, totalTurns, onTurnClick, latestTurn }: GameHeaderProps) => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-hotel-text">THE HOTEL GAME</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-hotel-primary" />
          <div className="flex gap-1 items-center">
            {Array.from({ length: totalTurns }).map((_, i) => {
              const turnNumber = i + 1;
              const isCurrentTurn = turnNumber === currentTurn;
              const isCompletedTurn = turnNumber <= latestTurn;
              const isClickable = turnNumber <= latestTurn;

              return (
                <button
                  key={i}
                  onClick={() => isClickable && onTurnClick(turnNumber)}
                  disabled={!isClickable}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    isCurrentTurn && "bg-hotel-primary text-white",
                    !isCurrentTurn && isCompletedTurn && "bg-hotel-accent text-hotel-primary hover:bg-hotel-primary hover:text-white",
                    !isCurrentTurn && !isCompletedTurn && "bg-gray-100 text-hotel-muted cursor-not-allowed",
                    isClickable && "cursor-pointer"
                  )}
                >
                  {turnNumber}
                </button>
              );
            })}
          </div>
        </div>
        <TeamLogo />
      </div>
    </header>
  );
};

export default GameHeader;