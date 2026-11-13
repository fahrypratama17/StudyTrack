import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useSidebar = (onNavigate?: () => void) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = () => {
    onNavigate?.();
  };

  const handleLogout = () => {
    logout();
    handleNavigate();
    navigate("/login", { replace: true });
  };

  return {
    handleNavigate,
    handleLogout,
  };
};
