import { BookOpen, Plus, Search } from "lucide-react";
import CourseCard from "../components/CourseCard";
import CourseForm from "../components/CourseForm";
import { useCoursePage } from "../hooks/useCoursePage";
import { dummyCourses } from "../data/data";
import CourseHeader from "../components/CourseHeader";

export default function Courses() {
  const {
    filteredCourses,
    search,
    setSearch,
    loading,
    saving,
    deletingId,
    error,
    formOpen,
    selectedCourse,
    openAddForm,
    openEditForm,
    closeForm,
    handleSave,
    handleDelete,
    loadCourses,
  } = useCoursePage();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex w-full flex-wrap items-center justify-between">
        <CourseHeader />

        <div className="focus-within:border-primary flex w-full items-center gap-3 rounded-2xl border border-[#E3ECF1] bg-white px-4 shadow-sm">
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
      ) : dummyCourses.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dummyCourses.map((course) => (
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
