import { Link } from "react-router-dom";

const MainNav = () => {
  return (
    <nav className="flex items-center space-x-4">
      <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link to="/game-edition" className="text-sm font-medium transition-colors hover:text-primary">
        Game Edition
      </Link>
    </nav>
  );
};

export default MainNav;