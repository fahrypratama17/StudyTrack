import { Plus } from "lucide-react";
import { useTaskPage } from "../hooks/useTaskPage";

const TaskHeader = () => {
  const { openAddForm } = useTaskPage();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-primary-text text-3xl font-bold md:text-4xl">
          Daftar Tugas
        </h1>

        <p className="text-secondary-text mt-2">
          Kelola tugas dan pantau deadline dari seluruh mata kuliahmu.
        </p>
      </div>

      <button
        type="button"
        onClick={openAddForm}
        className="bg-primary hover:bg-secondary flex cursor-pointer items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <Plus size={20} />
        Tambah Tugas
      </button>
    </header>
  );
};

export default TaskHeader;
