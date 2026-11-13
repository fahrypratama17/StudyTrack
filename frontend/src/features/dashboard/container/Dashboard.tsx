import {
  BookOpen,
  ClipboardList,
  ClockAlert,
  AlertTriangle,
} from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import DashboardWave from "../components/DashboardWave";
import DashboardBanner from "../components/DashboardBanner";
import { useDashboard } from "../hooks/useDashboard";
import TaskPriority from "../components/TaskPriority";
import TaskProgress from "../components/TaskProgress";
import TaskList from "../components/TaskList";
import DashboardHeader from "../components/DashboardHeader";

export default function Dashboard() {
  const { summary } = useDashboard();

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader />

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
