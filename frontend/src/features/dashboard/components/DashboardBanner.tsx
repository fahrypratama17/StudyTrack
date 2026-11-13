import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

const DashboardBanner = () => {
  return (
    <div className="relative z-10 max-w-2xl">
      <p className="text-sm font-medium text-white/75">
        Selamat datang di <span className="font-bold">StudyTrack</span>
      </p>

      <h2 className="mt-3 text-2xl font-bold md:text-3xl">
        Siap Menyelesaikan Tugas Hari Ini?
      </h2>

      <p className="mt-3 max-w-xl leading-relaxed text-white/80">
        Kelola mata kuliah, pantau deadline, dan pastikan setiap tugas
        terselesaikan tepat waktu.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          to="/tasks"
          className="group text-primary inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Tambah Tugas
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        <Link
          to="/courses"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/50 px-5 py-3 font-medium text-white transition-colors hover:bg-white/10"
        >
          <BookOpen size={16} />
          Mata Kuliah
        </Link>
      </div>
    </div>
  );
};

export default DashboardBanner;
