import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, ClipboardList, LogOut } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Mata Kuliah",
    to: "/courses",
    icon: BookOpen,
  },
  {
    label: "Daftar Tugas",
    to: "/tasks",
    icon: ClipboardList,
  },
];

const Sidebar = ({ className = "", onNavigate }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`border-primary/10 flex h-dvh w-64 shrink-0 flex-col border-r bg-white px-5 py-7 ${className}`}
    >
      <NavLink
        to="/dashboard"
        onClick={onNavigate}
        className="mb-12 flex items-center gap-3 px-3"
      >
        <img
          src="/logo.webp"
          alt="StudyTrack"
          className="h-10 w-10 object-contain"
        />

        <span className="text-primary-text text-2xl font-bold">
          Study<span className="text-primary">Track</span>
        </span>
      </NavLink>

      <nav
        aria-label="Navigasi dashboard"
        className="flex flex-1 flex-col gap-2"
      >
        <p className="text-secondary-text mb-3 px-4 text-xs font-semibold tracking-widest uppercase">
          Menu Utama
        </p>

        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-all duration-200 ${
                isActive
                  ? "bg-secondary-light text-primary"
                  : "text-secondary-text hover:bg-secondary-light/50 hover:text-primary"
              }`
            }
          >
            <Icon size={21} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-primary/10 border-t pt-5">
        <button
          type="button"
          onClick={handleLogout}
          className="text-secondary-text flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={21} />
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
