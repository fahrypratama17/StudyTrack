export interface Course {
  id: string | number;
  name: string;
  kode: string;
  dosen: string;
}

export interface CoursesResponse {
  courses: Course[];
}

export interface CourseFormData {
  name: string;
  kode: string;
  dosen: string;
}

export interface ApiErrorResponse {
  error?: string;
}