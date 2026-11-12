import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../../../shared/hooks/useAuth";
import { authenticate } from "../../../shared/repository/auth/action";
import type { LoginRequestDto } from "../../../shared/repository/auth/dto";

interface ApiErrorResponse {
  error?: string;
}

/** Halaman login StudyTrack. */
export default function Login() {
  const [email, setEmail] = useState<string>("demo@studytrack.test");
  const [password, setPassword] = useState<string>("demo1234");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError("");
    setLoading(true);

    const credentials: LoginRequestDto = {
      email,
      password,
    };

    try {
      const { token, user } = await authenticate(credentials);

      login(token, user);
      navigate("/tasks", { replace: true });
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorResponse>(err)) {
        setError(err.response?.data?.error ?? "Gagal login.");
      } else {
        setError("Terjadi kesalahan saat login.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page container">
      <div className="card">
        <h2>Login ke StudyTrack</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="muted-link">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>

        <p className="muted-link">
          Akun demo sudah terisi otomatis (demo@studytrack.test / demo1234).
        </p>
      </div>
    </div>
  );
}
