import CourseCard from "./CourseCard";
import type { Course } from "../types/type";

interface CourseListProps {
  courses: Course[];
  deletingId: Course["id"] | null;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const CourseList = ({
  courses,
  deletingId,
  onEdit,
  onDelete,
}: CourseListProps) => {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          deleting={deletingId === course.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};

export default CourseList;
