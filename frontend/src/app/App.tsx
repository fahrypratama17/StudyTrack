import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { useAuth } from "../shared/hooks/useAuth";
import Login from "../features/auth/container/Login";
import Register from "../features/auth/container/Register";
import Tasks from "../features/tasks/container/Tasks";
import Home from "../features/home/container/Home";
import DashboardLayout from "../shared/layout/DashboardLayout";
import Dashboard from "../features/dashboard/container/Dashboard";

/** Props untuk komponen ProtectedRoute. */
interface ProtectedRouteProps {
  children: ReactNode;
}

/** Membatasi akses halaman hanya untuk pengguna yang sudah login. */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container">Memuat...</div>;
  }

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
}

/** Daftar route utama aplikasi StudyTrack. */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

/** Root aplikasi dengan AuthProvider. */
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
