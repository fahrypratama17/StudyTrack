import { Link } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import AuthLayout from "../../../shared/layout/AuthLayout";
import AuthField from "../components/AuthField";
import { useRegister } from "../hooks/useRegister";

export default function Register() {
  const {
    nama,
    setNama,
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useRegister();

  return (
    <AuthLayout
      title="Buat Akun StudyTrack"
      description="Daftar untuk mulai mengelola tugas dan aktivitas kuliahmu dengan lebih mudah."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthField
          id="register-nama"
          label="Nama Lengkap"
          icon={UserRound}
          type="text"
          autoComplete="name"
          placeholder="Masukkan nama lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />

        <AuthField
          id="register-email"
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
          id="register-password"
          label="Kata Sandi"
          icon={LockKeyhole}
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
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
          className="group bg-primary hover:bg-secondary mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {loading ? "Mendaftarkan..." : "Daftar Sekarang"}

          {!loading && (
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
        </button>

        <p className="text-secondary-text mt-3 text-center text-sm">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-secondary font-semibold transition-colors"
          >
            Masuk
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
