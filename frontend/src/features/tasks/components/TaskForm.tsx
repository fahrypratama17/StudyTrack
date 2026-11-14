import { useForm, type SubmitHandler } from "react-hook-form";
import { X } from "lucide-react";

import type { Course } from "../../courses/types/type";
import type { Task, TaskFormData } from "../types/type";

interface TaskFormProps {
  task: Task | null;
  courses: Course[];
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (values: TaskFormData) => Promise<void>;
}

function toLocalDateTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

const TaskForm = ({
  task,
  courses,
  saving,
  error,
  onClose,
  onSave,
}: TaskFormProps) => {
  const isEditing = task !== null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      mata_kuliah_id: String(task?.mata_kuliah_id ?? ""),
      judul: task?.judul ?? "",
      deskripsi: task?.deskripsi ?? "",
      deadline: toLocalDateTime(task?.deadline),
    },
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<TaskFormData> = async (values) => {
    await onSave(values);
  };

  const inputClass =
    "w-full rounded-2xl border border-[#E3ECF1] bg-white px-4 py-3 text-sm text-primary-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="absolute inset-0 bg-[#0A172B]/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h2
              id="task-form-title"
              className="text-primary-text text-2xl font-bold"
            >
              {isEditing ? "Edit Tugas" : "Tambah Tugas"}
            </h2>

            <p className="text-secondary-text mt-2 text-sm">
              {isEditing
                ? "Perbarui informasi tugas kuliahmu."
                : "Catat tugas baru beserta deadline-nya."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-secondary-text cursor-pointer rounded-xl p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-course"
              className="text-primary-text text-sm font-semibold"
            >
              Mata Kuliah
            </label>

            {isEditing ? (
              <div className="text-primary-text rounded-2xl bg-[#F5FAFD] px-4 py-3 text-sm">
                {task.mata_kuliah ?? "Mata Kuliah"}
              </div>
            ) : (
              <select
                id="task-course"
                className={inputClass}
                defaultValue=""
                {...register("mata_kuliah_id", {
                  required: "Pilih mata kuliah terlebih dahulu.",
                })}
              >
                <option value="">Pilih mata kuliah</option>

                {courses.map((course) => (
                  <option key={course.id} value={String(course.id)}>
                    {course.name}
                  </option>
                ))}
              </select>
            )}

            {errors.mata_kuliah_id && (
              <p className="text-xs text-red-500">
                {errors.mata_kuliah_id.message}
              </p>
            )}

            {!isEditing && courses.length === 0 && (
              <p className="text-xs text-orange-600">
                Tambahkan mata kuliah terlebih dahulu.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-title"
              className="text-primary-text text-sm font-semibold"
            >
              Judul Tugas
            </label>

            <input
              id="task-title"
              className={inputClass}
              placeholder="Contoh: Laporan Praktikum SQL"
              {...register("judul", {
                validate: (value) =>
                  value.trim().length > 0 || "Judul tugas wajib diisi.",
              })}
            />

            {errors.judul && (
              <p className="text-xs text-red-500">{errors.judul.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-description"
              className="text-primary-text text-sm font-semibold"
            >
              Deskripsi
            </label>

            <textarea
              id="task-description"
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Catatan tambahan (opsional)"
              {...register("deskripsi")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-deadline"
              className="text-primary-text text-sm font-semibold"
            >
              Deadline
            </label>

            <input
              id="task-deadline"
              type="datetime-local"
              className={inputClass}
              {...register("deadline", {
                required: "Deadline wajib diisi.",
                validate: (value) =>
                  Number.isFinite(new Date(value).getTime()) ||
                  "Format deadline tidak valid.",
              })}
            />

            {errors.deadline && (
              <p className="text-xs text-red-500">{errors.deadline.message}</p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="text-primary border-primary/20 hover:bg-secondary-light flex-1 cursor-pointer rounded-2xl border py-3 font-semibold disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving || (!isEditing && courses.length === 0)}
              className="bg-primary hover:bg-secondary flex-1 cursor-pointer rounded-2xl py-3 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan Perubahan"
                  : "Tambah Tugas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
