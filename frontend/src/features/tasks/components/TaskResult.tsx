import TaskCard from "./TaskCard";
import { useTaskPage } from "../hooks/useTaskPage";
import TaskEmptyState from "./TaskEmptyState";

type TaskResultsProps = Pick<
  ReturnType<typeof useTaskPage>,
  | "filteredTasks"
  | "loading"
  | "loadError"
  | "loadTasks"
  | "search"
  | "activeFilter"
  | "counts"
  | "togglingId"
  | "deletingId"
  | "openEditForm"
  | "handleDelete"
  | "toggleTask"
  | "openAddForm"
>;

const TaskResult = ({
  filteredTasks,
  loading,
  loadError,
  loadTasks,
  search,
  activeFilter,
  counts,
  togglingId,
  deletingId,
  openEditForm,
  handleDelete,
  toggleTask,
  openAddForm,
}: TaskResultsProps) => {
  if (loading) {
    return (
      <div role="status" className="text-secondary-text py-16 text-center">
        Memuat daftar tugas...
      </div>
    );
  }

  if (loadError) {
    return (
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
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <TaskEmptyState
        search={search}
        activeFilter={activeFilter}
        counts={counts}
        openAddForm={openAddForm}
      />
    );
  }

  return (
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
  );
};

export default TaskResult;
