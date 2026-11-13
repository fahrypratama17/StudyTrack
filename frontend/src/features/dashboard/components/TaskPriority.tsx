import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { statusStyles } from "../types/type";
import { formatDeadline } from "../hooks/useFormatDeadline";

const TaskPriority = () => {
  const { priorityTasks } = useDashboard();

  return (
    <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-primary-text text-xl font-bold">
            Tugas Prioritas
          </h3>
          <p className="text-secondary-text mt-1 text-sm">
            Tugas yang perlu segera diperhatikan.
          </p>
        </div>

        <Link
          to="/tasks"
          className="text-primary hover:text-secondary flex shrink-0 items-center gap-1 text-sm font-semibold"
        >
          Lihat Semua
          <ArrowRight size={17} />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {priorityTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#F5FAFD] px-5 py-12 text-center">
            <CheckCircle2 size={40} className="text-secondary" />
            <p className="text-primary-text mt-4 font-semibold">
              Tidak ada tugas prioritas
            </p>
            <p className="text-secondary-text mt-2 text-sm">
              Belum ada tugas mendesak atau terlambat.
            </p>
          </div>
        ) : (
          priorityTasks.map((task) => {
            const status = statusStyles[task.priority];

            return (
              <div
                key={task.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#E3ECF1] p-4 transition-colors hover:bg-[#F8FCFF] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h4 className="text-primary-text font-semibold">
                    {task.judul}
                  </h4>

                  <p className="text-secondary-text mt-1 text-sm">
                    {task.mata_kuliah ?? "Tanpa Mata Kuliah"}
                  </p>

                  <p className="text-secondary-text mt-2 flex items-center gap-2 text-xs">
                    <CalendarDays size={15} />
                    {formatDeadline(task.deadline)}
                  </p>
                </div>

                <span
                  className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskPriority;
