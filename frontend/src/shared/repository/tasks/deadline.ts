import type { DeadlineState, Task } from "../../../features/tasks/types/type";

/** Kategori berasal dari snapshot waktu backend, bukan jam perangkat pengguna. */
export function getDeadlineState(task: Task): DeadlineState {
  if (task.status === "selesai") return "selesai";
  if (task.deadline_category === "overdue") return "terlambat";
  if (task.deadline_category === "mendekati_deadline") return "mendesak";
  return "belum";
}

/** Pertahankan urutan API juga setelah penambahan atau perubahan lokal. */
export function compareTasks(a: Task, b: Task): number {
  const order = { mendekati_deadline: 0, overdue: 1, normal: 2 };
  const categoryDiff = order[a.deadline_category] - order[b.deadline_category];
  if (categoryDiff !== 0) return categoryDiff;
  if (a.deadline_category !== "normal") {
    const deadlineDiff = Date.parse(a.deadline) - Date.parse(b.deadline);
    if (deadlineDiff !== 0) return deadlineDiff;
  }
  return (
    Date.parse(b.created_at) - Date.parse(a.created_at) ||
    Number(b.id) - Number(a.id)
  );
}
