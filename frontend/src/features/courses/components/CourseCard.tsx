import { BookOpen, UserRound, Pencil, Trash2 } from "lucide-react";

import type { Course } from "../types/type";

interface CourseCardProps {
  course: Course;
  deleting: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const CourseCard = ({
  course,
  deleting,
  onEdit,
  onDelete,
}: CourseCardProps) => {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="bg-secondary-light flex h-14 w-14 items-center justify-center rounded-2xl">
          <BookOpen size={26} className="text-secondary" />
        </div>
        <span className="bg-secondary-light text-secondary rounded-full px-3 py-1.5 text-xs font-semibold">
          {course.kode || "Tanpa Kode"}
        </span>
      </div>

      <div className="mt-6 flex-1">
        <h3 className="text-primary-text text-xl font-bold">{course.name}</h3>
        <div className="text-secondary-text mt-4 flex items-center gap-2 text-sm">
          <UserRound size={18} />
          <span>{course.dosen || "Dosen belum diisi"}</span>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-end gap-3 border-t border-[#E3ECF1] pt-5">
        <button
          type="button"
          onClick={() => onEdit(course)}
          className="text-primary bg-secondary-light flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#D3EAF7]"
        >
          <Pencil size={17} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(course)}
          disabled={deleting}
          className="flex cursor-pointer items-center gap-2 rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          <Trash2 size={17} />
          {deleting ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </article>
  );
};

export default CourseCard;
