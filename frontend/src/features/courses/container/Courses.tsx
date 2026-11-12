import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import api from "../../../service/api";
import Navbar from "../../../shared/components/Navbar";
import type {
  Course,
  CoursesResponse,
  CourseFormData,
  ApiErrorResponse,
} from "../types/type";

/** Halaman Mata Kuliah: form tambah dan daftar mata kuliah milik pengguna. */
export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState<string>("");
  const [kode, setKode] = useState<string>("");
  const [dosen, setDosen] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function loadCourses(): Promise<void> {
    try {
      const res = await api.get<CoursesResponse>("/courses");
      setCourses(res.data.courses);
    } catch {
      setError("Gagal memuat mata kuliah.");
    }
  }

  useEffect(() => {
    void loadCourses();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError("");

    const formData: CourseFormData = {
      name,
      kode,
      dosen,
    };

    try {
      await api.post("/courses", formData);

      setName("");
      setKode("");
      setDosen("");

      await loadCourses();
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorResponse>(err)) {
        setError(err.response?.data?.error ?? "Gagal menambahkan mata kuliah.");
      } else {
        setError("Gagal menambahkan mata kuliah.");
      }
    }
  }

  async function handleDelete(id: Course["id"]): Promise<void> {
    setError("");

    try {
      await api.delete(`/courses/${id}`);
      await loadCourses();
    } catch {
      setError("Gagal menghapus mata kuliah.");
    }
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Mata Kuliah</h1>

        <div className="card">
          <h2>Tambah Mata Kuliah</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nama Mata Kuliah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Kode Mata Kuliah"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
            />

            <input
              type="text"
              placeholder="Dosen Pengampu"
              value={dosen}
              onChange={(e) => setDosen(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button type="submit">Tambah</button>
          </form>
        </div>

        {courses.map((c: Course) => (
          <div className="card" key={c.id}>
            <strong>{c.name}</strong> {c.kode && <span>({c.kode})</span>}
            <div className="meta">{c.dosen}</div>
            <button
              className="btn"
              style={{ marginTop: 10 }}
              onClick={() => handleDelete(c.id)}
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
