import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const TaskCourse = () => {
  return (
    <div className="text-secondary-text flex flex-wrap items-center gap-2 text-sm">
      <BookOpen size={18} />
      <span>Belum ada mata kuliah.</span>
      <Link
        to="/courses"
        className="text-primary inline-flex items-center gap-1 font-semibold hover:underline"
      >
        Tambah Mata Kuliah
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default TaskCourse;
