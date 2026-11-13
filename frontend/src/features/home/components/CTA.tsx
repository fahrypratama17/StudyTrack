import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CTAWave from "./CTAWave";

const CTA = () => {
  return (
    <section id="cta" className="mx-auto max-w-375 px-8 py-16">
      <div className="bg-gradient relative isolate flex h-[70vh] items-center justify-center overflow-hidden rounded-3xl px-6 py-14 text-center">
        <CTAWave />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4">
          <h2 className="text-primary-text text-3xl font-bold tracking-tight md:text-4xl">
            Siap Membuat Kuliahmu Lebih Teratur?
          </h2>

          <p className="text-secondary-text max-w-2xl text-base leading-relaxed">
            Kelola tugas, pantau deadline, dan atur mata kuliahmu dengan lebih
            mudah bersama StudyTrack.
          </p>

          <Link
            to="/register"
            className="bg-primary hover:bg-secondary mt-3 inline-flex items-center gap-3 rounded-2xl px-8 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Mulai Gratis
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
