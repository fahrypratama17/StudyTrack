import { Search } from "lucide-react";
import { useTaskPage } from "../hooks/useTaskPage";
import type { TaskFilter } from "../types/type";

const filters: { value: TaskFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "mendesak", label: "Mendesak" },
  { value: "terlambat", label: "Terlambat" },
  { value: "belum", label: "Belum Selesai" },
  { value: "selesai", label: "Selesai" },
];

const TaskSearch = () => {
  const {
    filteredTasks,
    counts,
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
  } = useTaskPage();

  return (
    <section className="flex flex-col gap-5">
      <div className="focus-within:border-primary flex w-full items-center gap-3 rounded-2xl border border-white/80 bg-white px-4 shadow-sm transition-colors">
        <Search size={20} className="text-secondary-text shrink-0" />

        <input
          type="search"
          placeholder="Cari judul, deskripsi, atau mata kuliah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-primary-text w-full bg-transparent py-3.5 text-sm outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter) => {
          const active = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                active
                  ? "border-primary bg-primary text-white"
                  : "text-secondary-text hover:border-primary/40 hover:text-primary border-white/80 bg-white"
              }`}
            >
              {filter.label}
              <span className="ml-2 opacity-70">{counts[filter.value]}</span>
            </button>
          );
        })}
      </div>

      <p className="text-secondary-text text-sm">
        Menampilkan {filteredTasks.length} dari {counts.semua} tugas
      </p>
    </section>
  );
};

export default TaskSearch;
