export type TaskStatus = "belum" | "selesai";

export type DeadlineState = "belum" | "mendesak" | "terlambat" | "selesai";

export type TaskFilter =
  "semua" | "mendesak" | "terlambat" | "belum" | "selesai";

export interface Task {
  id: string | number;
  mata_kuliah_id: string | number;
  mata_kuliah: string | null;
  judul: string;
  deskripsi: string;
  deadline: string;
  status: TaskStatus;
  created_at: string;
}

export interface TaskView extends Task {
  deadlineState: DeadlineState;
}

export interface TaskFormData {
  mata_kuliah_id: string;
  judul: string;
  deskripsi: string;
  deadline: string;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
}

export interface ApiErrorResponse {
  error?: string;
}
