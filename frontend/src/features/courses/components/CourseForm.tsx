import { Course, CourseFormData } from "../types/type";
import { SubmitHandler, useForm } from "react-hook-form";
import { X } from "lucide-react";

interface CourseFormProps {
  course: Course | null;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (values: CourseFormData) => Promise<void>;
}

const CourseForm = ({
  course,
  saving,
  error,
  onClose,
  onSave,
}: CourseFormProps) => {
  const isEditing = course !== null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: {
      name: course?.name ?? "",
      kode: course?.kode ?? "",
      dosen: course?.dosen ?? "",
    },
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<CourseFormData> = async (values) => {
    await onSave(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="bg-primary-text/50 absolute inset-0 backdrop-blur-sm"
      />

      <div
        role="dialog"
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
      >
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2
              id="course-modal-title"
              className="text-primary-text text-2xl font-bold"
            >
              {isEditing ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
            </h2>

            <p className="text-secondary-text mt-2 text-sm">
              {isEditing
                ? "Perbarui informasi mata kuliahmu."
                : "Lengkapi informasi mata kuliah baru."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-secondary-text cursor-pointer rounded-xl p-2 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="course-name"
              className="text-primary-text text-sm font-semibold"
            >
              Nama Mata Kuliah
            </label>

            <input
              id="course-name"
              placeholder="Contoh: Pemrograman Web"
              className="focus:border-primary focus:ring-primary/10 w-full rounded-2xl border border-white/80 px-4 py-3 outline-none focus:ring-2"
              {...register("name", {
                validate: (value) =>
                  value.trim().length > 0 || "Nama mata kuliah wajib diisi.",
              })}
            />

            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="course-code"
              className="text-primary-text text-sm font-semibold"
            >
              Kode Mata Kuliah
            </label>

            <input
              id="course-code"
              placeholder="Contoh: IF2201"
              className="focus:border-primary focus:ring-primary/10 w-full rounded-2xl border border-white/80 px-4 py-3 outline-none focus:ring-2"
              {...register("kode")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="course-lecturer"
              className="text-primary-text text-sm font-semibold"
            >
              Dosen Pengampu
            </label>

            <input
              id="course-lecturer"
              placeholder="Contoh: Budi Santoso"
              className="focus:border-primary focus:ring-primary/10 w-full rounded-2xl border border-white/80 px-4 py-3 outline-none focus:ring-2"
              {...register("dosen")}
            />
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
              disabled={saving}
              className="bg-primary hover:bg-secondary flex-1 cursor-pointer rounded-2xl py-3 font-semibold text-white transition-colors"
            >
              {saving
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan Perubahan"
                  : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
