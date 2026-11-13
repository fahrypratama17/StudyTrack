import { Link } from "react-router-dom";
import FooterWave from "./FooterWave";

const navigation = [
  { label: "Beranda", href: "#beranda" },
  { label: "Manfaat", href: "#manfaat" },
  { label: "Cara Kerja", href: "#cara-kerja" },
];

const Footer = () => {
  return (
    <footer
      id="tentang"
      className="bg-gradient relative overflow-hidden rounded-3xl"
    >
      <div className="relative z-10 grid grid-cols-1 gap-12 px-8 pt-14 pb-36 md:grid-cols-2 lg:px-16">
        <div className="flex flex-col items-start">
          <a href="#beranda" className="flex items-center gap-3">
            <img src="/logo.webp" alt="" className="h-12 w-12 object-contain" />

            <h2 className="text-primary-text text-3xl font-bold">
              Study
              <span className="text-primary">Track</span>
            </h2>
          </a>

          <p className="text-secondary-text mt-5 max-w-md text-base leading-relaxed">
            StudyTrack membantu mahasiswa mengelola mata kuliah, mencatat tugas,
            dan memantau deadline dengan lebih mudah dalam satu tempat.
          </p>

          <p className="text-secondary-text mt-8 text-sm">
            &Copy; {new Date().getFullYear()} StudyTrack. Seluruh hak cipta
            dilindungi.
          </p>
        </div>

        <div className="flex flex-col md:items-end">
          <nav aria-label="Navigasi footer" className="flex flex-col gap-5">
            <h3 className="text-primary-text text-xl font-bold">Navigasi</h3>

            <div className="flex flex-col gap-y-5">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-secondary-text hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  {item.label}
                </a>
              ))}

              <Link
                to="/register"
                className="text-secondary-text hover:text-primary transition-all duration-300 hover:translate-x-1"
              >
                Mulai Gratis
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <FooterWave />
    </footer>
  );
};

export default Footer;
