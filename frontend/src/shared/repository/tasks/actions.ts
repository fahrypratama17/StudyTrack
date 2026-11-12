import api from "../../../service/api";
import type { CreateTaskRequestDto, UpdateTaskStatusRequestDto } from "./dto";
import type { Task, TaskStatus } from "../../../features/tasks/types/type";

/** Menambahkan tugas baru. */
export async function createTask(data: CreateTaskRequestDto): Promise<void> {
  await api.post("/tasks", data);
}

/** Memperbarui status tugas. */
export async function updateTaskStatus(
  id: Task["id"],
  status: TaskStatus,
): Promise<void> {
  const data: UpdateTaskStatusRequestDto = {
    status,
  };

  await api.put(`/tasks/${id}`, data);
}

/** Menghapus tugas berdasarkan ID. */
export async function deleteTask(id: Task["id"]): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
