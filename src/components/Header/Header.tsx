import TeamMenu from "./TeamMenu";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {children}
      </div>
      <TeamMenu />
    </header>
  );
};

export default Header;