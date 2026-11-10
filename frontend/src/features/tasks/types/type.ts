export type TaskStatus = "belum" | "selesai";

export interface Task {
  id: string | number;
  mata_kuliah_id: string | number;
  mata_kuliah: string;
  judul: string;
  deskripsi: string;
  deadline: string;
  status: TaskStatus;
}

export interface TaskCardProps {
  task: Task;
  onToggleStatus: (task: Task) => Promise<void>;
  onDelete: (id: Task["id"]) => Promise<void>;
}
