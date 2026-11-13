import { useState } from "react";
import { BookOpen, GraduationCap, Plus, Search } from "lucide-react";
import CourseCard from "../components/CourseCard";
import CourseForm from "../components/CourseForm";
import { useCourses } from "../hooks/useCourses";
import type { Course, CourseFormData } from "../types/type";

export default function Courses() {
  const {
    courses,
    filteredCourses,
    search,
    setSearch,
    loading,
    saving,
    deletingId,
    error,
    clearError,
    loadCourses,
    saveCourse,
    deleteCourse,
  } = useCourses();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const openAddForm = () => {
    clearError();
    setSelectedCourse(null);
    setFormOpen(true);
  };

  const openEditForm = (course: Course) => {
    clearError();
    setSelectedCourse(course);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    clearError();
    setSelectedCourse(null);
    setFormOpen(false);
  };

  const handleSave = async (values: CourseFormData) => {
    const success = await saveCourse(values, selectedCourse?.id);

    if (success) {
      closeForm();
    }
  };

  const handleDelete = async (course: Course) => {
    const confirmed = window.confirm(
      `Hapus mata kuliah "${course.name}"? Semua tugas yang terkait juga akan terhapus.`,
    );

    if (!confirmed) return;

    await deleteCourse(course.id);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-primary-text text-3xl font-bold md:text-4xl">
            Mata Kuliah
          </h1>

          <p className="text-secondary-text mt-2">
            Kelola mata kuliah yang kamu ambil pada semester ini.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="bg-primary hover:bg-secondary flex cursor-pointer items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus size={20} />
          Tambah Mata Kuliah
        </button>
      </header>

      <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-r from-[#1F506D] to-[#0D6684] px-7 py-9 text-white md:px-10">
        <svg
          viewBox="0 0 500 200"
          preserveAspectRatio="none"
          className="pointer-events-none absolute right-0 bottom-0 -z-10 h-full w-[50%] opacity-20"
        >
          <path
            d="M0 170 C90 70 180 190 290 90 C370 15 430 100 500 25 L500 200 L0 200 Z"
            fill="white"
          />
          <path
            d="M0 190 C110 130 220 200 340 130 C420 75 470 140 500 110 L500 200 L0 200 Z"
            fill="#BDE0F0"
          />
        </svg>

        <div className="relative flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <GraduationCap size={34} />
          </div>

          <div>
            <p className="text-sm text-white/75">Semester Berjalan</p>

            <h2 className="mt-1 text-2xl font-bold">
              {courses.length} Mata Kuliah Terdaftar
            </h2>

            <p className="mt-2 text-sm text-white/80">
              Susun aktivitas kuliahmu dengan lebih terorganisir.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-primary-text text-xl font-bold">
            Daftar Mata Kuliah
          </h2>

          <p className="text-secondary-text mt-1 text-sm">
            Menampilkan {filteredCourses.length} dari {courses.length} mata
            kuliah
          </p>
        </div>

        <div className="focus-within:border-primary flex w-full items-center gap-3 rounded-2xl border border-[#E3ECF1] bg-white px-4 shadow-sm sm:max-w-sm">
          <Search size={20} className="text-secondary-text shrink-0" />

          <input
            type="search"
            placeholder="Cari nama, kode, atau dosen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-primary-text w-full bg-transparent py-3.5 text-sm outline-none"
          />
        </div>
      </section>

      {!formOpen && error && (
        <div
          role="alert"
          className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-secondary-text py-16 text-center">
          Memuat mata kuliah...
        </div>
      ) : filteredCourses.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              deleting={deletingId === course.id}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-[#E3ECF1] bg-white px-6 py-16 text-center">
          <div className="bg-secondary-light flex h-20 w-20 items-center justify-center rounded-3xl">
            <BookOpen size={36} className="text-secondary" />
          </div>

          <h3 className="text-primary-text mt-6 text-xl font-bold">
            {search ? "Mata Kuliah Tidak Ditemukan" : "Belum Ada Mata Kuliah"}
          </h3>

          <p className="text-secondary-text mt-3 max-w-sm text-sm">
            {search
              ? "Coba gunakan kata kunci pencarian lainnya."
              : "Tambahkan mata kuliah pertamamu untuk mulai mengelola tugas."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={openAddForm}
              className="bg-primary hover:bg-secondary mt-6 cursor-pointer rounded-2xl px-6 py-3 font-semibold text-white"
            >
              Tambah Mata Kuliah
            </button>
          )}

          {error && (
            <button
              type="button"
              onClick={() => void loadCourses()}
              className="text-primary mt-4 text-sm font-medium underline"
            >
              Coba muat ulang
            </button>
          )}
        </section>
      )}

      {formOpen && (
        <CourseForm
          key={selectedCourse?.id ?? "new"}
          course={selectedCourse}
          saving={saving}
          error={error}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
