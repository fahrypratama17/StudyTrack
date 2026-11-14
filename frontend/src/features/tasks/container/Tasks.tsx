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
import TaskSearch from "../components/TaskSearch";
import TaskEmptyState from "../components/TaskEmptyState";
import TaskResult from "../components/TaskResult";

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

      <TaskSearch />

      {!formOpen && actionError && (
        <p
          role="alert"
          className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600"
        >
          {actionError}
        </p>
      )}

      <TaskResult
        filteredTasks={filteredTasks}
        counts={counts}
        search={search}
        activeFilter={activeFilter}
        loading={loading}
        loadError={loadError}
        loadTasks={loadTasks}
        togglingId={togglingId}
        deletingId={deletingId}
        openAddForm={openAddForm}
        openEditForm={openEditForm}
        handleDelete={handleDelete}
        toggleTask={toggleTask}
      />

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
