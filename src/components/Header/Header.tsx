import TeamMenu from "./TeamMenu";

interface HeaderProps {
  children?: React.ReactNode;
  currentTurn?: number;
  totalTurns?: number;
}

const Header = ({ children, currentTurn, totalTurns }: HeaderProps) => {
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
        )}
        <TeamMenu />
      </div>
    </header>
  );
};

export default Header;