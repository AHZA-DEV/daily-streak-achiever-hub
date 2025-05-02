
import { Link, useLocation } from "react-router-dom";
import { Calendar, BarChart, Award, Home } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-purple-900/30 py-2 px-4 sm:px-6 md:top-0 md:bottom-auto md:border-b md:border-t-0 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="hidden md:block">
            <Link to="/" className="text-purple-400 font-semibold text-xl flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">Habito</span>
              <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 rounded px-2 py-0.5 text-white">Tech</span>
            </Link>
          </div>
          
          <div className="flex justify-around w-full md:w-auto md:ml-10 space-x-2 md:space-x-8">
            <NavLink to="/" active={path === "/"} icon={<Home size={20} />} label="Hari Ini" />
            <NavLink to="/calendar" active={path === "/calendar"} icon={<Calendar size={20} />} label="Kalender" />
            <NavLink to="/insights" active={path === "/insights"} icon={<BarChart size={20} />} label="Wawasan" />
            <NavLink to="/achievements" active={path === "/achievements"} icon={<Award size={20} />} label="Lencana" />
          </div>
          
          <div className="hidden md:block">
            {/* Add user profile or settings here if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  icon: JSX.Element;
  label: string;
}

const NavLink = ({ to, active, icon, label }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-all ${
        active
          ? "text-white bg-gradient-to-r from-purple-700 to-indigo-600 font-medium neo-glow"
          : "text-gray-400 hover:text-purple-400 hover:bg-purple-900/20"
      }`}
    >
      <span className="mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </Link>
  );
};

export default NavBar;
