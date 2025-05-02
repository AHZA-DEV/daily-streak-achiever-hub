
import { Link, useLocation } from "react-router-dom";
import { Calendar, BarChart, Award, Home } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 sm:px-6 md:top-0 md:bottom-auto md:border-b md:border-t-0 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="hidden md:block">
            <Link to="/" className="text-habito-purple-dark font-semibold text-xl">
              Habito
            </Link>
          </div>
          
          <div className="flex justify-around w-full md:w-auto md:ml-10 space-x-2 md:space-x-8">
            <NavLink to="/" active={path === "/"} icon={<Home size={20} />} label="Today" />
            <NavLink to="/calendar" active={path === "/calendar"} icon={<Calendar size={20} />} label="Calendar" />
            <NavLink to="/insights" active={path === "/insights"} icon={<BarChart size={20} />} label="Insights" />
            <NavLink to="/achievements" active={path === "/achievements"} icon={<Award size={20} />} label="Badges" />
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
      className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
        active
          ? "text-habito-purple bg-habito-purple-light font-medium"
          : "text-gray-600 hover:text-habito-purple hover:bg-habito-purple-light/50"
      }`}
    >
      <span className="mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </Link>
  );
};

export default NavBar;
