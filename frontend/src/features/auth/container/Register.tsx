import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../../../shared/hooks/useAuth";
import { registerAction } from "../../../shared/repository/auth/action";
import type { RegisterRequestDto } from "../../../shared/repository/auth/dto";

interface ApiErrorResponse {
  error?: string;
}

/** Halaman pendaftaran akun baru. */
export default function Register() {
  const [nama, setNama] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const formData: RegisterRequestDto = {
      nama: nama.trim(),
      email: email.trim(),
      password,
    };

    try {
      const { token, user } = await registerAction(formData);
      login(token, user);
      navigate("/tasks", { replace: true });
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorResponse>(err)) {
        setError(err.response?.data?.error ?? "Gagal mendaftar.");
      } else {
        setError("Terjadi kesalahan saat mendaftar.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page container">
      <div className="card">
        <h2>Daftar Akun StudyTrack</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            autoComplete="name"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Password (minimal 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="muted-link">
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}
