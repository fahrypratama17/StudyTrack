import { BookOpen } from "lucide-react";

interface CourseEmptyStateProps {
  search: string;
  error: string | null;
  onAdd: () => void;
  onRetry: () => void;
}

const CourseEmptyState = ({
  search,
  error,
  onAdd,
  onRetry,
}: CourseEmptyStateProps) => {
  return (
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
          onClick={onAdd}
          className="bg-primary hover:bg-secondary mt-6 cursor-pointer rounded-2xl px-6 py-3 font-semibold text-white"
        >
          Tambah Mata Kuliah
        </button>
      )}

      {error && (
        <button
          type="button"
          onClick={onRetry}
          className="text-primary mt-4 text-sm font-medium underline"
        >
          Coba muat ulang
        </button>
      )}
    </section>
  );
};

export default CourseEmptyState;
