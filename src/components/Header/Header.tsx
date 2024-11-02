import TeamMenu from "./TeamMenu";

interface HeaderProps {
  children?: React.ReactNode;
  currentTurn?: number;
  totalTurns?: number;
  onTurnSelect?: (turn: number) => void;
}

const Header = ({ children, currentTurn, totalTurns, onTurnSelect }: HeaderProps) => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {children}
      </div>
      <div className="flex items-center gap-6">
        {currentTurn && totalTurns && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center">
              {Array.from({ length: totalTurns }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => onTurnSelect?.(i + 1)}
                  disabled={i + 1 > currentTurn}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    i + 1 === currentTurn
                      ? "bg-hotel-primary text-white"
                      : i + 1 < currentTurn
                      ? "bg-hotel-accent text-hotel-primary hover:bg-hotel-accent/80 cursor-pointer"
                      : "bg-gray-100 text-hotel-muted cursor-not-allowed"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        <TeamMenu />
      </div>
    </header>
  );
};

export default Header;