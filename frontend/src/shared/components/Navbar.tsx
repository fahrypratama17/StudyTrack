import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/** Bilah navigasi atas. Menampilkan menu sesuai status login. */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="border-b-primary/20 text-primary-text flex w-full border-b bg-white p-4 px-8 shadow-sm">
      <div className="flex w-[70%] items-center justify-start gap-2">
        <img src="/logo.webp" alt="logo" width={40} />
        <p className="text-primary-text text-[32px] font-bold">
          Study<span className="text-primary">Track</span>
        </p>
      </div>
      <nav className="flex w-full items-center justify-between text-xl">
        {user ? (
          <>
            <Link to="/courses" className="hover:text-primary">
              Mata Kuliah
            </Link>
            <Link to="/tasks" className="hover:text-primary">
              Daftar Tugas
            </Link>
            <span>{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <div className="flex gap-12">
              <Link to="/" className="hover:text-primary">
                Beranda
              </Link>
              <Link to="/#manfaat" className="hover:text-primary">
                Manfaat
              </Link>
              <Link to="/#tentang" className="hover:text-primary">
                Tentang
              </Link>
            </div>
            <div className="flex w-full max-w-60 gap-4">
              <Link
                to="/login"
                className="hover:text-primary border-primary hover:bg-primary flex-1 rounded-2xl border py-2 text-center hover:text-white"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-primary border-primary hover:text-primary flex-1 rounded-2xl border py-2 text-center text-white hover:bg-white"
              >
                Mulai
              </Link>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
