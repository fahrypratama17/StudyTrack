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

function formatDeadline(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tanggal tidak valid";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function Dashboard() {
  const { summary, priorityTasks, recentTasks } = useDashboard();

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

      <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm md:p-8">
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

        <div className="rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-7">
            <h3 className="text-primary-text text-xl font-bold">
              Progres Tugas
            </h3>

            <p className="text-secondary-text mt-1 text-sm">
              Ringkasan penyelesaian tugas kuliahmu.
            </p>
          </div>

          <div className="flex justify-center">
            <div
              role="progressbar"
              aria-label="Progres penyelesaian tugas"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={summary.completionRate}
              className="flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(
                  #0D6684 ${summary.completionRate}%,
                  #E6F3FB ${summary.completionRate}%
                )`,
              }}
            >
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-primary-text text-4xl font-bold">
                  {summary.completionRate}%
                </span>

                <span className="text-secondary-text mt-1 text-sm">
                  Selesai
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#E4F5EF] p-4 text-center">
              <p className="text-2xl font-bold text-[#168567]">
                {summary.completed}
              </p>

              <p className="mt-1 text-xs text-[#168567]">Selesai</p>
            </div>

            <div className="rounded-2xl bg-[#FFF0E5] p-4 text-center">
              <p className="text-2xl font-bold text-[#C77B3B]">
                {summary.pending}
              </p>

              <p className="mt-1 text-xs text-[#C77B3B]">Belum Selesai</p>
            </div>
          </div>
        </div>
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
