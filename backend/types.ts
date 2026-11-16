export interface UserProfile {
  id: number;
  nama: string;
  email: string;
}

export interface User extends UserProfile {
  password_hash: string;
}

export interface Course {
  id: number;
  user_id: number;
  name: string;
  kode: string;
  dosen: string;
}

export type TaskStatus = "belum" | "selesai";

export interface Task {
  id: number;
  user_id: number;
  mata_kuliah_id: number;
  judul: string;
  deskripsi: string;
  deadline: string;
  status: TaskStatus;
  created_at: string;
}

export type DeadlineCategory = "mendekati_deadline" | "overdue" | "normal";

export interface TaskResponse extends Task {
  mata_kuliah: string;
  deadline_category: DeadlineCategory;
  remaining_seconds: number;
}

export interface RegisterBody {
  nama?: string;
  email?: string;
  password?: string;
}

export type LoginBody = Pick<RegisterBody, "email" | "password">;
export type CourseBody = Partial<Pick<Course, "name" | "kode" | "dosen">>;

export interface CreateTaskBody {
  mata_kuliah_id?: number | string;
  judul?: string;
  deskripsi?: string;
  deadline?: string;
}

export interface UpdateTaskBody {
  judul?: string;
  deskripsi?: string;
  deadline?: string;
  status?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
    }
  }
}
