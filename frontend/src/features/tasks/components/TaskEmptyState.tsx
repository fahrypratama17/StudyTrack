import { ClipboardList, Plus } from "lucide-react";

import type { useTaskPage } from "../hooks/useTaskPage";

type TaskEmptyStateProps = Pick<
  ReturnType<typeof useTaskPage>,
  "search" | "activeFilter" | "counts" | "openAddForm"
>;

const TaskEmptyState = ({
  search,
  activeFilter,
  counts,
  openAddForm,
}: TaskEmptyStateProps) => {
  const title = search
    ? "Tugas Tidak Ditemukan"
    : activeFilter !== "semua"
      ? "Tidak Ada Tugas dalam Kategori Ini"
      : "Belum Ada Tugas";

  const description =
    search || activeFilter !== "semua"
      ? "Coba ubah pencarian atau pilih filter lainnya."
      : "Tambahkan tugas pertamamu untuk mulai memantau deadline.";

  return (
    <section className="flex flex-col items-center justify-center rounded-2xl border border-[#E3ECF1] bg-white px-6 py-16 text-center">
      <div className="bg-secondary-light flex h-20 w-20 items-center justify-center rounded-2xl">
        <ClipboardList size={36} className="text-secondary" />
      </div>
      <h3 className="text-primary-text mt-6 text-xl font-bold">{title}</h3>
      <p className="text-secondary-text mt-3 max-w-sm text-sm leading-relaxed">
        {description}
      </p>

      {counts.semua === 0 && (
        <button
          type="button"
          onClick={openAddForm}
          className="bg-primary hover:bg-secondary mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white transition-colors"
        >
          <Plus size={18} />
          Tambah Tugas
        </button>
      )}
    </section>
  );
};

export default TaskEmptyState;
