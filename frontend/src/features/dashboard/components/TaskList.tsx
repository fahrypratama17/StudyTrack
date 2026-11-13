import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, ClipboardList } from "lucide-react";
import { statusStyles } from "../types/type";
import { formatDeadline } from "../hooks/useFormatDeadline";
import { useDashboard } from "../hooks/useDashboard";

const TaskList = () => {
  const { recentTasks } = useDashboard();

  return (
    <section className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-primary-text text-xl font-bold">Tugas Terbaru</h3>
          <p className="text-secondary-text mt-1 text-sm">
            Daftar tugas yang baru ditambahkan.
          </p>
        </div>

        <Link
          to="/tasks"
          className="text-primary hover:text-secondary flex shrink-0 items-center gap-1 text-sm font-semibold"
        >
          Lihat Semua
          <ArrowRight size={16} />
        </Link>
      </div>

      {recentTasks.length === 0 ? (
        <div className="rounded-2xl bg-[#F5FAFD] p-10 text-center">
          <ClipboardList size={36} className="text-secondary mx-auto mb-3" />
          <p className="text-primary-text font-semibold">Belum ada tugas</p>
          <p className="text-secondary-text mt-2 text-sm">
            Mulai tambahkan tugas pertamamu.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E3ECF1]">
          {recentTasks.map((task) => {
            const status = statusStyles[task.priority];

            return (
              <div
                key={task.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
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
          })}
        </div>
      )}
    </section>
  );
};

export default TaskList;
