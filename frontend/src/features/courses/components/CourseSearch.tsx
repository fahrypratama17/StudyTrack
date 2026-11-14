import { Search } from "lucide-react";
import { useCoursePage } from "../hooks/useCoursePage";

const CourseSearch = () => {
  const { search, setSearch } = useCoursePage();

  return (
    <section className="flex w-full flex-wrap items-center justify-between">
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
  );
};

export default CourseSearch;
