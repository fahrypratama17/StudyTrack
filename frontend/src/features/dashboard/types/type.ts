export interface DashboardCourse {
  id: number;
  name: string;
  kode: string;
  dosen: string;
}

export interface DashboardTask {
  id: number;
  judul: string;
  deskripsi: string;
  deadline: string;
  status: "belum" | "selesai";
  created_at: string;
  mata_kuliah_id: number;
  mata_kuliah: string | null;
}

export type TaskPriority = "normal" | "mendesak" | "terlambat" | "selesai";

export interface DashboardTaskWithPriority extends DashboardTask {
  priority: TaskPriority;
}

export interface DashboardSummary {
  totalCourses: number;
  totalTasks: number;
  pending: number;
  completed: number;
  urgent: number;
  overdue: number;
  completionRate: number;
}
