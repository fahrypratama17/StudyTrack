import { useCallback, useEffect, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import Navbar from "../../../shared/components/Navbar";
import TaskCard from "../components/TaskCard";
import { getTasks } from "../../../shared/repository/tasks/query";
import { getCourses } from "../../../shared/repository/courses/query";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../../../shared/repository/tasks/actions";
import type { Task } from "../types/type";
import type { Course } from "../../courses/types/type";
import type { CreateTaskRequestDto } from "../../../shared/repository/tasks/dto";

interface ApiErrorResponse {
  error?: string;
}

/** Halaman daftar dan manajemen tugas. */
export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [courseId, setCourseId] = useState<string>("");
  const [judul, setJudul] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  /** Mengambil pesan error dari Axios. */
  function getErrorMessage(err: unknown, fallback: string): string {
    if (isAxiosError<ApiErrorResponse>(err)) {
      return err.response?.data?.error ?? fallback;
    }

    return fallback;
  }

  /** Mengambil ulang seluruh data halaman. */
  const loadData = useCallback(async (): Promise<void> => {
    const [taskList, courseList] = await Promise.all([
      getTasks(),
      getCourses(),
    ]);

    setTasks(taskList);
    setCourses(courseList);
  }, []);

  /** Memuat data saat halaman pertama dibuka. */
  useEffect(() => {
    let cancelled = false;

    async function initialize(): Promise<void> {
      try {
        const [taskList, courseList] = await Promise.all([
          getTasks(),
          getCourses(),
        ]);

        if (cancelled) return;

        setTasks(taskList);
        setCourses(courseList);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Gagal memuat data."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  /** Menambahkan tugas baru. */
  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (submitting) return;

    setError("");

    if (!courseId) {
      setError("Pilih mata kuliah terlebih dahulu.");
      return;
    }

    const formData: CreateTaskRequestDto = {
      mata_kuliah_id: courseId,
      judul,
      deskripsi,
      deadline,
    };

    setSubmitting(true);

    try {
      await createTask(formData);

      setJudul("");
      setDeskripsi("");
      setDeadline("");

      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal menambahkan tugas."));
    } finally {
      setSubmitting(false);
    }
  }

  /** Mengubah status tugas. */
  async function handleToggleStatus(task: Task): Promise<void> {
    setError("");

    const newStatus = task.status === "selesai" ? "belum" : "selesai";

    try {
      await updateTaskStatus(task.id, newStatus);
      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal mengubah status tugas."));
    }
  }

  /** Menghapus tugas. */
  async function handleDelete(id: Task["id"]): Promise<void> {
    setError("");

    try {
      await deleteTask(id);
      await loadData();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal menghapus tugas."));
    }
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Daftar Tugas</h1>

        <div className="card">
          <h2>Tambah Tugas</h2>

          <form onSubmit={handleSubmit}>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              <option value="">-- Pilih Mata Kuliah --</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Judul Tugas"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
            />

            <textarea
              placeholder="Deskripsi (opsional)"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={2}
            />

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Menambahkan..." : "Tambah Tugas"}
            </button>
          </form>
        </div>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p>Memuat tugas...</p>
        ) : (
          <>
            {tasks.length === 0 && !error && (
              <p>Belum ada tugas. Tambahkan tugas pertama Anda di atas.</p>
            )}

            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
