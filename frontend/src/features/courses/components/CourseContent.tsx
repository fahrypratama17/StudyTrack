import CourseList from "./CourseList";
import CourseEmptyState from "./CourseEmptyState";
import type { Course } from "../types/type";

interface CourseContentProps {
  courses: Course[];
  loading: boolean;
  deletingId: Course["id"] | null;
  search: string;
  error: string | null;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onAdd: () => void;
  onRetry: () => void;
}

const CourseContent = ({
  courses,
  loading,
  deletingId,
  search,
  error,
  onEdit,
  onDelete,
  onAdd,
  onRetry,
}: CourseContentProps) => {
  if (loading) {
    return (
      <div className="text-secondary-text py-16 text-center">
        Memuat mata kuliah...
      </div>
    );
  }

  if (courses.length > 0) {
    return (
      <CourseList
        courses={courses}
        deletingId={deletingId}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <CourseEmptyState
      search={search}
      error={error}
      onAdd={onAdd}
      onRetry={onRetry}
    />
  );
};

export default CourseContent;
