import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);

    if (!location.hash) return;

    const id = decodeURIComponent(location.hash.slice(1));

    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <Link to="/" className="flex shrink-0 items-center gap-2">
        <img
          src="/logo.webp"
          alt="Logo StudyTrack"
          className="h-10 w-10 object-contain"
        />

        <p className="text-primary-text text-2xl font-bold">
          Study<span className="text-primary">Track</span>
        </p>
      </Link>

      <nav className="hidden flex-1 items-center justify-between pl-12 text-base lg:flex">
        {user ? (
          <>
            <div className="flex items-center gap-8">
              <Link
                to="/courses"
                className="hover:text-secondary transition-colors"
              >
                Mata Kuliah
              </Link>

              <Link
                to="/tasks"
                className="hover:text-secondary transition-colors"
              >
                Daftar Tugas
              </Link>
            </div>

            <div className="flex items-center gap-5">
              <span className="text-secondary-text">{user.name}</span>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-primary hover:bg-secondary rounded-full px-6 py-2.5 font-medium text-white transition-colors"
              >
                Keluar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex items-center gap-9">
              <Link
                to="/#beranda"
                className="hover:text-secondary transition-colors"
              >
                Beranda
              </Link>
              <Link
                to="/#cara-kerja"
                className="hover:text-secondary transition-colors"
              >
                Cara Kerja
              </Link>
              <Link
                to="/#manfaat"
                className="hover:text-secondary transition-colors"
              >
                Manfaat
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                to="/login"
                className="border-primary text-primary hover:bg-secondary-light rounded-full border px-6 py-2.5 font-medium transition-all duration-300"
              >
                Masuk
              </Link>

              <Link
                to="/register"
                className="bg-primary hover:bg-secondary rounded-full px-7 py-2.5 font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Mulai
              </Link>
            </div>
          </>
        )}
      </nav>

      <button
        type="button"
        aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-primary ml-auto lg:hidden"
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {menuOpen && (
        <nav
          aria-label="Navigasi mobile"
          className="border-primary/10 absolute top-[calc(100%+12px)] right-0 left-0 flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-xl lg:hidden"
        >
          {user ? (
            <>
              <Link to="/courses">Mata Kuliah</Link>
              <Link to="/tasks">Daftar Tugas</Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-left"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/">Beranda</Link>
              <Link to="/#manfaat">Manfaat</Link>
              <Link to="/#carakerja">Cara Kerja</Link>
              <Link to="/login">Masuk</Link>
              <Link
                to="/register"
                className="bg-primary rounded-xl px-5 py-3 text-center text-white"
              >
                Mulai Gratis
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
