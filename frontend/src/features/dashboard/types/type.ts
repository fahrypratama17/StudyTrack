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

export const statusStyles: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  mendesak: {
    label: "Mendesak",
    className: "bg-orange-100 text-orange-700",
  },
  terlambat: {
    label: "Terlambat",
    className: "bg-red-100 text-red-700",
  },
  selesai: {
    label: "Selesai",
    className: "bg-green-100 text-green-700",
  },
  normal: {
    label: "Belum",
    className: "bg-yellow-100 text-yellow-700",
  },
};
