import api from "../../../service/api";
import type { Task} from "../../../features/tasks/types/type";
import type { TasksResponseDto} from "./dto";

/** Mengambil seluruh tugas pengguna. */
export async function getTasks(): Promise<Task[]> {
  const response = await api.get<TasksResponseDto>(
    "/tasks"
  );

  return response.data.tasks;
}