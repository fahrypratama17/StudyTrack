import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthWave from "../components/AuthWave";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

const AuthLayout = ({ title, description, children }: AuthLayoutProps) => {
  return (
    <main className="bg-gradient relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4">
      <AuthWave />

      <div className="shadow-primary/10 relative z-10 w-full max-w-115 rounded-3xl border border-white/80 bg-white/95 p-7 shadow-xl backdrop-blur-xl sm:p-10">
        <Link
          to="/"
          className="group text-secondary-text hover:text-primary mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Kembali ke Beranda
        </Link>

        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <img src="/logo.webp" alt="" className="h-11 w-11 object-contain" />

          <span className="text-primary-text text-3xl font-bold">
            Study<span className="text-primary">Track</span>
          </span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-primary-text text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>

          <p className="text-secondary-text mt-3 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
