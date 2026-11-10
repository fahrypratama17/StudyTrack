import api from "../../../service/api";

import type {
  Course,
  CoursesResponse
} from "../../../features/courses/types/type";

/** Mengambil seluruh mata kuliah pengguna. */
export async function getCourses(): Promise<Course[]> {
  const response = await api.get<CoursesResponse>(
    "/courses"
  );

  return response.data.courses;
}