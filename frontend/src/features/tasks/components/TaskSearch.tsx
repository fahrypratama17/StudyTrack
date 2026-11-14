import { Search } from "lucide-react";
import { useTaskPage } from "../hooks/useTaskPage";
import TaskFilter from "./TaskFilter";

const TaskSearch = () => {
  const { search, setSearch } = useTaskPage();

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

      <TaskFilter />
    </section>
  );
};

export default TaskSearch;
