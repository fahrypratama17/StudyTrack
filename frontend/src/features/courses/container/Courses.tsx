import CourseForm from "../components/CourseForm";
import { useCoursePage } from "../hooks/useCoursePage";
import { dummyCourses } from "../data/data";
import CourseHeader from "../components/CourseHeader";
import CourseSearch from "../components/CourseSearch";
import CourseContent from "../components/CourseContent";

export default function Courses() {
  const {
    filteredCourses,
    search,
    loading,
    saving,
    deletingId,
    error,
    formOpen,
    selectedCourse,
    openAddForm,
    openEditForm,
    closeForm,
    handleSave,
    handleDelete,
    loadCourses,
  } = useCoursePage();

  return (
    <div className="flex flex-col gap-8">
      <CourseHeader />
      <CourseSearch />

      {!formOpen && error && (
        <div
          role="alert"
          className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <CourseContent
        courses={dummyCourses}
        loading={loading}
        deletingId={deletingId}
        search={search}
        error={error}
        onEdit={openEditForm}
        onDelete={handleDelete}
        onAdd={openAddForm}
        onRetry={() => void loadCourses()}
      />

      {formOpen && (
        <CourseForm
          key={selectedCourse?.id ?? "new"}
          course={selectedCourse}
          saving={saving}
          error={error}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
