import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ClipboardList,
  ClockAlert,
  Plus,
  Search,
} from "lucide-react";

import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useTaskPage } from "../hooks/useTaskPage";
import type { TaskFilter } from "../types/type";
import TaskBanner from "../components/TaskBanner";
import TaskHeader from "../components/TaskHeader";

export default function Tasks() {
  const {
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
  } = useTaskPage();

  return (
    <div className="flex flex-col gap-8">
      <TaskHeader />
      <TaskBanner />

      {!formOpen && actionError && (
        <p
          role="alert"
          className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600"
        >
          {actionError}
        </p>
      )}

      {loading ? (
        <div role="status" className="text-secondary-text py-16 text-center">
          Memuat daftar tugas...
        </div>
      ) : loadError ? (
        <section className="rounded-3xl border border-red-100 bg-white px-6 py-14 text-center">
          <p role="alert" className="text-red-600">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() => void loadTasks()}
            className="text-primary mt-4 cursor-pointer font-semibold underline"
          >
            Coba Muat Ulang
          </button>
        </section>
      ) : filteredTasks.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              toggling={togglingId === task.id}
              deleting={deletingId === task.id}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onToggle={toggleTask}
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-[#E3ECF1] bg-white px-6 py-16 text-center">
          <div className="bg-secondary-light flex h-20 w-20 items-center justify-center rounded-3xl">
            <ClipboardList size={36} className="text-secondary" />
          </div>

          <h3 className="text-primary-text mt-6 text-xl font-bold">
            {search
              ? "Tugas Tidak Ditemukan"
              : activeFilter !== "semua"
                ? "Tidak Ada Tugas dalam Kategori Ini"
                : "Belum Ada Tugas"}
          </h3>

          <p className="text-secondary-text mt-3 max-w-sm text-sm leading-relaxed">
            {search || activeFilter !== "semua"
              ? "Coba ubah pencarian atau pilih filter lainnya."
              : "Tambahkan tugas pertamamu untuk mulai memantau deadline."}
          </p>

          {counts.semua === 0 && (
            <button
              type="button"
              onClick={openAddForm}
              className="bg-primary hover:bg-secondary mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white transition-colors"
            >
              <Plus size={18} />
              Tambah Tugas
            </button>
          )}
        </section>
      )}

      {formOpen && (
        <TaskForm
          key={selectedTask?.id ?? "new"}
          task={selectedTask}
          courses={courses}
          saving={saving}
          error={actionError}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}

      {!loading && !loadError && courses.length === 0 && (
        <div className="text-secondary-text flex items-center gap-2 text-sm">
          <BookOpen size={18} />
          Belum ada mata kuliah.
          <a
            href="/courses"
            className="text-primary inline-flex items-center gap-1 font-semibold hover:underline"
          >
            Tambah Mata Kuliah
            <ArrowRight size={16} />
          </a>
        </div>
      )}
    </div>
  );
}
