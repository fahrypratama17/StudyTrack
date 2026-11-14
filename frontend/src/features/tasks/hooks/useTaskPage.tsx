import { useEffect, useMemo, useState } from "react";

import { useTasks } from "./useTask";

import type {
  Task,
  TaskFilter,
  TaskFormData,
  TaskView,
  DeadlineState,
} from "../types/type";

const ONE_DAY = 24 * 60 * 60 * 1000;

function getDeadlineState(task: Task, now: number): DeadlineState {
  if (task.status === "selesai") return "selesai";

  const deadline = new Date(task.deadline).getTime();

  if (!Number.isFinite(deadline)) return "belum";

  const remaining = deadline - now;

  if (remaining < 0) return "terlambat";
  if (remaining < ONE_DAY) return "mendesak";

  return "belum";
}

const priorityOrder: Record<DeadlineState, number> = {
  mendesak: 0,
  terlambat: 1,
  belum: 2,
  selesai: 3,
};

export function useTaskPage() {
  const {
    tasks,
    courses,
    loading,
    saving,
    deletingId,
    togglingId,
    loadError,
    actionError,
    clearError,
    loadTasks,
    saveTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("semua");

  const [formOpen, setFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const tasksWithState = useMemo<TaskView[]>(() => {
    return tasks.map((task) => ({
      ...task,
      deadlineState: getDeadlineState(task, now),
    }));
  }, [tasks, now]);

  const counts = useMemo(() => {
    return {
      semua: tasksWithState.length,
      mendesak: tasksWithState.filter(
        (task) => task.deadlineState === "mendesak",
      ).length,
      terlambat: tasksWithState.filter(
        (task) => task.deadlineState === "terlambat",
      ).length,
      belum: tasksWithState.filter((task) => task.status === "belum").length,
      selesai: tasksWithState.filter((task) => task.status === "selesai")
        .length,
    };
  }, [tasksWithState]);

  const filteredTasks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tasksWithState
      .filter((task) => {
        const matchesSearch =
          !keyword ||
          [task.judul, task.deskripsi, task.mata_kuliah ?? ""].some((value) =>
            value.toLowerCase().includes(keyword),
          );

        const matchesFilter =
          activeFilter === "semua" ||
          (activeFilter === "belum"
            ? task.status === "belum"
            : task.deadlineState === activeFilter);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const priorityDiff =
          priorityOrder[a.deadlineState] - priorityOrder[b.deadlineState];

        if (priorityDiff !== 0) return priorityDiff;

        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
  }, [tasksWithState, search, activeFilter]);

  const openAddForm = () => {
    clearError();
    setSelectedTask(null);
    setFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    clearError();
    setSelectedTask(task);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    clearError();
    setSelectedTask(null);
    setFormOpen(false);
  };

  const handleSave = async (values: TaskFormData) => {
    const success = await saveTask(values, selectedTask);

    if (success) {
      clearError();
      setSelectedTask(null);
      setFormOpen(false);
    }
  };

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus tugas "${task.judul}"?`,
    );

    if (!confirmed) return;

    await deleteTask(task.id);
  };

  return {
    courses,
    filteredTasks,
    counts,
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    loading,
    saving,
    deletingId,
    togglingId,
    loadError,
    actionError,
    loadTasks,
    formOpen,
    selectedTask,
    openAddForm,
    openEditForm,
    closeForm,
    handleSave,
    handleDelete,
    toggleTask,
  };
}
