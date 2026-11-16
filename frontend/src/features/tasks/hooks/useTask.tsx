import { useCallback, useEffect, useRef, useState } from "react";
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
  const loadVersion = useRef(0);

  const loadTasks = useCallback(async (silent = false) => {
    const version = ++loadVersion.current;
    if (!silent) setLoading(true);

    try {
      const [taskRes, courseRes] = await Promise.all([
        api.get<TasksResponse>("/tasks"),
        api.get<CoursesResponse>("/courses"),
      ]);

      if (version !== loadVersion.current) return;
      setTasks(taskRes.data.tasks);
      setCourses(courseRes.data.courses);
      setLoadError("");
    } catch (err: unknown) {
      if (version === loadVersion.current) {
        setLoadError(getErrorMessage(err, "Gagal memuat daftar tugas."));
      }
    } finally {
      if (version === loadVersion.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
    const refresh = () => {
      if (document.visibilityState === "visible") void loadTasks(true);
    };
    const interval = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      loadVersion.current++;
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [loadTasks]);

  const saveTask = async (
    values: TaskFormData,
    selectedTask: Task | null,
  ): Promise<boolean> => {
    if (saving) return false;

    setSaving(true);
    setActionError("");

    try {
      const payload = {
        judul: values.judul.trim(),
        deskripsi: values.deskripsi.trim(),
        deadline: new Date(values.deadline).toISOString(),
      };
      if (selectedTask) {
        const response = await api.put<TaskResponse>(
          `/tasks/${encodeURIComponent(String(selectedTask.id))}`,
          payload,
        );

        loadVersion.current++;
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

        loadVersion.current++;
        setTasks((prev) => [response.data.task, ...prev]);
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
      const response = await api.put<TaskResponse>(
        `/tasks/${encodeURIComponent(String(task.id))}`,
        {
          status,
        },
      );

      loadVersion.current++;
      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? response.data.task : item)),
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

      loadVersion.current++;
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
