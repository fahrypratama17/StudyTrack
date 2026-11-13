import { Link } from "react-router-dom";
import { ArrowRight, CirclePlay } from "lucide-react";
import WaveBackground from "./WaveBackground";

const Hero = () => {
  return (
    <section className="bg-gradient relative m-8 min-h-[80vh] overflow-hidden rounded-2xl">
      <div className="relative z-10 grid min-h-[80vh] grid-cols-2 items-center gap-8 p-8 pb-28">
        <div className="flex flex-col justify-center gap-8">
          <h1 className="text-primary-text text-[42px] font-bold">
            Kuliah Lebih Teratur, Tugas Lebih{" "}
            <span className="text-primary">Terkelola</span>
          </h1>

          <p className="text-secondary-text text-[24px]">
            Kelola mata kuliah, catat tugas, dan pantau deadline dalam satu
            tempat. Bantu aktivitas kuliahmu lebih terorganisir dan produktif
            bersama StudyTrack.
          </p>

          <div className="flex w-[70%] gap-4 text-[18px]">
            <Link
              to="/register"
              className="group bg-primary hover:bg-secondary flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
            >
              Mulai Gratis{" "}
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </Link>

            <a
              href="#carakerja"
              className="group border-primary/10 text-primary-text hover:border-primary/30 hover:bg-secondary-light flex flex-1 items-center justify-center gap-2 rounded-2xl border bg-white py-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
            >
              <CirclePlay
                size={20}
                className="text-primary transition-transform duration-300 group-hover:scale-110"
              />
              Lihat Cara Kerjanya
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src="/hero.webp"
            alt="Ilustrasi StudyTrack"
            className="w-full max-w-175 object-contain"
          />
        </div>
      </div>

      <WaveBackground />
    </section>
  );
};

export default Hero;
