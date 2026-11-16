import type { DeadlineCategory, Task, TaskResponse } from "../types.js";

export const DAY_MS = 24 * 60 * 60 * 1000;

export function deadlineCategory(task: Pick<Task, "deadline" | "status">, now: Date): DeadlineCategory {
  if (task.status === "selesai") return "normal";
  const remaining = Date.parse(task.deadline) - now.getTime();
  if (remaining <= 0) return "overdue";
  if (remaining < DAY_MS) return "mendekati_deadline";
  return "normal";
}

export function presentTask(task: Task & { mata_kuliah: string }, now: Date): TaskResponse {
  return {
    ...task,
    deadline_category: deadlineCategory(task, now),
    remaining_seconds: Math.floor((Date.parse(task.deadline) - now.getTime()) / 1000),
  };
}

const priority: Record<DeadlineCategory, number> = { mendekati_deadline: 0, overdue: 1, normal: 2 };

export function sortTasks(tasks: TaskResponse[]): TaskResponse[] {
  return [...tasks].sort((a, b) => {
    const group = priority[a.deadline_category] - priority[b.deadline_category];
    if (group) return group;
    if (a.deadline_category !== "normal") {
      const deadline = Date.parse(a.deadline) - Date.parse(b.deadline);
      if (deadline) return deadline;
    }
    return Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id;
  });
}
