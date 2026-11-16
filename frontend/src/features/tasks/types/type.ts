export type TaskStatus = "belum" | "selesai";
export type DeadlineCategory = "mendekati_deadline" | "overdue" | "normal";

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
  deadline_category: DeadlineCategory;
  remaining_seconds: number;
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
  server_time: string;
}

export interface TaskResponse {
  task: Task;
  server_time: string;
}

export interface ApiErrorResponse {
  error?: string;
}
