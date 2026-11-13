import type { Task, TaskStatus } from "../../../features/tasks/types/type";

export interface TasksResponseDto {
  tasks: Task[];
}

export interface CreateTaskRequestDto {
  mata_kuliah_id: string;
  judul: string;
  deskripsi: string;
  deadline: string;
}

export interface UpdateTaskStatusRequestDto {
  status: TaskStatus;
}
