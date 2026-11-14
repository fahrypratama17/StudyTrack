import { dummyCourses } from "../data/data";
import CourseCard from "./CourseCard";
import { useCoursePage } from "../hooks/useCoursePage";

const CourseList = () => {
  const { deletingId, openEditForm, handleDelete } = useCoursePage();

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {dummyCourses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          deleting={deletingId === course.id}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      ))}
    </section>
  );
};

export default CourseList;
