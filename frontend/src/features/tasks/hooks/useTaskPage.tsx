import { useMemo, useState } from "react";
import {
  compareTasks,
  getDeadlineState,
} from "../../../shared/repository/tasks/deadline";

import { useTasks } from "./useTask";

import type { Task, TaskFilter, TaskFormData, TaskView } from "../types/type";

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

  const tasksWithState = useMemo<TaskView[]>(() => {
    return tasks.map((task) => ({
      ...task,
      deadlineState: getDeadlineState(task),
    }));
  }, [tasks]);

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
      .sort(compareTasks);
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
