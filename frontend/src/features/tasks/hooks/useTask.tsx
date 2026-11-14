import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";

import api from "../../../service/api";

import type { Course, CoursesResponse } from "../../courses/types/type";

import type {
  Task,
  TaskFormData,
  TaskResponse,
  TasksResponse,
  ApiErrorResponse,
} from "../types/type";

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.error ?? fallback;
  }

  return fallback;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<Task["id"] | null>(null);
  const [togglingId, setTogglingId] = useState<Task["id"] | null>(null);

  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const [taskRes, courseRes] = await Promise.all([
        api.get<TasksResponse>("/tasks"),
        api.get<CoursesResponse>("/courses"),
      ]);

      setTasks(taskRes.data.tasks);
      setCourses(courseRes.data.courses);
    } catch (err: unknown) {
      setLoadError(getErrorMessage(err, "Gagal memuat daftar tugas."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const saveTask = async (
    values: TaskFormData,
    selectedTask: Task | null,
  ): Promise<boolean> => {
    if (saving) return false;

    setSaving(true);
    setActionError("");

    const payload = {
      judul: values.judul.trim(),
      deskripsi: values.deskripsi.trim(),
      deadline: new Date(values.deadline).toISOString(),
    };

    try {
      if (selectedTask) {
        const response = await api.put<TaskResponse>(
          `/tasks/${encodeURIComponent(String(selectedTask.id))}`,
          payload,
        );

        setTasks((prev) =>
          prev.map((task) =>
            task.id === selectedTask.id
              ? { ...task, ...response.data.task }
              : task,
          ),
        );
      } else {
        const courseId = Number(values.mata_kuliah_id);

        const response = await api.post<TaskResponse>("/tasks", {
          ...payload,
          mata_kuliah_id: courseId,
        });

        const course = courses.find((item) => Number(item.id) === courseId);

        setTasks((prev) => [
          {
            ...response.data.task,
            mata_kuliah: course?.name ?? null,
          },
          ...prev,
        ]);
      }

      return true;
    } catch (err: unknown) {
      setActionError(
        getErrorMessage(
          err,
          selectedTask
            ? "Gagal memperbarui tugas."
            : "Gagal menambahkan tugas.",
        ),
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (task: Task) => {
    if (togglingId !== null) return;

    setTogglingId(task.id);
    setActionError("");

    const status = task.status === "selesai" ? "belum" : "selesai";

    try {
      await api.put(`/tasks/${encodeURIComponent(String(task.id))}`, {
        status,
      });

      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? { ...item, status } : item)),
      );
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Gagal mengubah status tugas."));
    } finally {
      setTogglingId(null);
    }
  };

  const deleteTask = async (id: Task["id"]) => {
    if (deletingId !== null) return;

    setDeletingId(id);
    setActionError("");

    try {
      await api.delete(`/tasks/${encodeURIComponent(String(id))}`);

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Gagal menghapus tugas."));
    } finally {
      setDeletingId(null);
    }
  };

  return {
    tasks,
    courses,
    loading,
    saving,
    deletingId,
    togglingId,
    loadError,
    actionError,
    clearError: () => setActionError(""),
    loadTasks,
    saveTask,
    toggleTask,
    deleteTask,
  };
}
