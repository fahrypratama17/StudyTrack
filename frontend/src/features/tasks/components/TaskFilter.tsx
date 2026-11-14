import { useTaskPage } from "../hooks/useTaskPage";
import type { TaskFilter } from "../types/type";

const filters: { value: TaskFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "mendesak", label: "Mendesak" },
  { value: "terlambat", label: "Terlambat" },
  { value: "belum", label: "Belum Selesai" },
  { value: "selesai", label: "Selesai" },
];

const TaskFilter = () => {
  const { filteredTasks, counts, activeFilter, setActiveFilter } =
    useTaskPage();

  return (
    <>
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
                  : "text-secondary-text hover:border-primary/40 hover:text-primary border-[#E3ECF1] bg-white"
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
    </>
  );
};

export default TaskFilter;
