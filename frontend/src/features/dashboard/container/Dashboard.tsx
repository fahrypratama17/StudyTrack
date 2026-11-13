import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  ClockAlert,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import DashboardWave from "../components/DashboardWave";
import DashboardBanner from "../components/DashboardBanner";
import { useDashboard } from "../hooks/useDashboard";
import { statusStyles } from "../types/type";
import { formatDeadline } from "../hooks/useFormatDeadline";
import TaskPriority from "../components/TaskPriority";
import TaskProgress from "../components/TaskProgress";

export default function Dashboard() {
  const { summary, recentTasks } = useDashboard();

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-primary-text text-3xl font-bold md:text-4xl">
            Dashboard
          </h1>

          <p className="text-secondary-text mt-2">
            Pantau seluruh aktivitas perkuliahanmu dalam satu tempat.
          </p>
        </div>

        <div className="text-secondary-text flex items-center gap-2 rounded-xl border border-white/70 bg-white px-4 py-3 text-sm">
          <CalendarDays size={20} className="text-primary" />
          {today}
        </div>
      </header>

      <section className="from-primary to-secondary relative isolate overflow-hidden rounded-2xl bg-linear-to-r px-7 py-9 text-white md:px-10 md:py-12">
        <DashboardWave />
        <DashboardBanner />
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Mata Kuliah"
          value={summary.totalCourses}
          description="Mata kuliah terdaftar"
          icon={BookOpen}
          tone="blue"
        />

        <SummaryCard
          title="Belum Selesai"
          value={summary.pending}
          description="Tugas yang perlu dikerjakan"
          icon={ClipboardList}
          tone="purple"
        />

        <SummaryCard
          title="Tugas Mendesak"
          value={summary.urgent}
          description="Deadline kurang dari 24 jam"
          icon={ClockAlert}
          tone="orange"
        />

        <SummaryCard
          title="Tugas Terlambat"
          value={summary.overdue}
          description="Sudah melewati deadline"
          icon={AlertTriangle}
          tone="red"
        />
      </section>

      <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <TaskPriority />
        <TaskProgress />
      </section>

      <section className="rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-primary-text text-xl font-bold">
              Tugas Terbaru
            </h3>

            <p className="text-secondary-text mt-1 text-sm">
              Daftar tugas yang baru ditambahkan.
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
    </div>
  );
}
