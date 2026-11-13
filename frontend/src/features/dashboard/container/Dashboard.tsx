import {
  BookOpen,
  ClipboardList,
  ClockAlert,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import DashboardWave from "../components/DashboardWave";
import DashboardBanner from "../components/DashboardBanner";
import { useDashboard } from "../hooks/useDashboard";
import TaskPriority from "../components/TaskPriority";
import TaskProgress from "../components/TaskProgress";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const { summary } = useDashboard();

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

      <TaskList />
    </div>
  );
}
