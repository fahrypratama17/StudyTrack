import { Link } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import AuthLayout from "../../../shared/layout/AuthLayout";
import AuthField from "../components/AuthField";
import { useLogin } from "../hooks/useLogin";

interface ApiErrorResponse {
  error?: string;
}

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();

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
