import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../../../shared/hooks/useAuth";
import { authenticate } from "../../../shared/repository/auth/action";
import type { LoginRequestDto } from "../../../shared/repository/auth/dto";

import AuthLayout from "../../../shared/layout/AuthLayout";
import AuthField from "../components/AuthField";

interface ApiErrorResponse {
  error?: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
    <AuthLayout
      title="Selamat Datang Kembali!"
      description="Masuk untuk melanjutkan pengelolaan tugas dan aktivitas kuliahmu."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthField
          id="login-email"
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthField
          id="login-password"
          label="Kata Sandi"
          icon={LockKeyhole}
          type="password"
          autoComplete="current-password"
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p
            role="alert"
            className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group bg-primary hover:bg-secondary mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}

          {!loading && (
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
        </button>

        <p className="text-secondary-text mt-3 text-center text-sm">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-primary hover:text-secondary font-semibold transition-colors"
          >
            Daftar Sekarang
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
