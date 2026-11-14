import { useCallback, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";

import api from "../../../service/api";

import type {
  Course,
  CourseFormData,
  CoursesResponse,
  ApiErrorResponse,
} from "../types/type";

interface CourseResponse {
  course: Course;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.error ?? fallback;
  }

  return fallback;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<Course["id"] | null>(null);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<CoursesResponse>("/courses");
      setCourses(response.data.courses);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal memuat mata kuliah."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return courses;

    return courses.filter((course) =>
      [course.name, course.kode, course.dosen].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    );
  }, [courses, search]);

  const saveCourse = async (
    values: CourseFormData,
    id?: Course["id"],
  ): Promise<boolean> => {
    setSaving(true);
    setError("");

    const formData: CourseFormData = {
      name: values.name.trim(),
      kode: values.kode.trim(),
      dosen: values.dosen.trim(),
    };

    try {
      if (id !== undefined) {
        const response = await api.put<CourseResponse>(
          `/courses/${encodeURIComponent(String(id))}`,
          formData,
        );

        setCourses((prev) =>
          prev.map((course) =>
            course.id === id ? response.data.course : course,
          ),
        );
      } else {
        const response = await api.post<CourseResponse>("/courses", formData);

        setCourses((prev) => [response.data.course, ...prev]);
      }

      return true;
    } catch (err: unknown) {
      setError(
        getErrorMessage(
          err,
          id !== undefined
            ? "Gagal memperbarui mata kuliah."
            : "Gagal menambahkan mata kuliah.",
        ),
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id: Course["id"]): Promise<boolean> => {
    setDeletingId(id);
    setError("");

    try {
      await api.delete(`/courses/${encodeURIComponent(String(id))}`);

      setCourses((prev) => prev.filter((course) => course.id !== id));

      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal menghapus mata kuliah."));

      return false;
    } finally {
      setDeletingId(null);
    }
  };

  return {
    courses,
    filteredCourses,
    search,
    setSearch,
    loading,
    saving,
    deletingId,
    error,
    clearError: () => setError(""),
    loadCourses,
    saveCourse,
    deleteCourse,
  };
}
