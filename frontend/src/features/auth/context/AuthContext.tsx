import {
  createContext,
  useEffect,
  useState,
} from "react";
import { TOKEN_KEY } from "../../../service/api";
import type {
  AuthContextType,
  AuthProviderProps,
  User
} from "../types/type";
import { getCurrentUser} from "../../../shared/repository/auth/query";
import {
  loginAction,
  logoutAction
} from "../../../shared/repository/auth/action";

export const AuthContext = createContext<AuthContextType | null>(
  null
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth(): Promise<void> {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();

        if (!cancelled) {
          setUser(userData);
        }
      } catch {
        if (!cancelled) {
          logoutAction();
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  function login(token: string, userData: User): void {
    loginAction(token);
    setUser(userData);
  }

  function logout(): void {
    logoutAction();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}