import { useState } from "react";
import { useCourses } from "./useCourses";
import type { Course, CourseFormData } from "../types/type";

export function useCoursePage() {
  const {
    filteredCourses,
    search,
    setSearch,
    loading,
    saving,
    deletingId,
    error,
    clearError,
    loadCourses,
    saveCourse,
    deleteCourse,
  } = useCourses();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const openAddForm = () => {
    clearError();
    setSelectedCourse(null);
    setFormOpen(true);
  };

  const openEditForm = (course: Course) => {
    clearError();
    setSelectedCourse(course);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    clearError();
    setSelectedCourse(null);
    setFormOpen(false);
  };

  const handleSave = async (values: CourseFormData) => {
    if (saving) return;

    const success = await saveCourse(values, selectedCourse?.id);

    if (success) {
      clearError();
      setSelectedCourse(null);
      setFormOpen(false);
    }
  };

  const handleDelete = async (course: Course) => {
    const confirmed = window.confirm(
      `Hapus mata kuliah "${course.name}"? Semua tugas yang terkait juga akan terhapus.`,
    );

    if (!confirmed) return;

    await deleteCourse(course.id);
  };

  return {
    filteredCourses,
    search,
    setSearch,
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
  };
}
