import { Plus } from "lucide-react";
import { useCoursePage } from "../hooks/useCoursePage";

const CourseHeader = () => {
  const { openAddForm } = useCoursePage();

  return (
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
  );
};

export default CourseHeader;
