import TaskForm from "../components/TaskForm";
import { useTaskPage } from "../hooks/useTaskPage";
import TaskBanner from "../components/TaskBanner";
import TaskHeader from "../components/TaskHeader";
import TaskSearch from "../components/TaskSearch";
import TaskResult from "../components/TaskResult";
import TaskCourse from "../components/TaskCourse";

export default function Tasks() {
  const {
    courses,
    filteredTasks,
    counts,
    search,
    activeFilter,
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

      {!loading && !loadError && courses.length === 0 && <TaskCourse />}
    </div>
  );
}
