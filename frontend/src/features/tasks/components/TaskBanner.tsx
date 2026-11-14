import { AlertTriangle, ClockAlert } from "lucide-react";
import { useTaskPage } from "../hooks/useTaskPage";
import TaskWave from "./TaskWave";

const TaskBanner = () => {
  const { counts } = useTaskPage();

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-[#DCEAF2] bg-white px-6 py-6 shadow-sm md:px-8">
      <TaskWave />

      <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <div className="bg-secondary-light flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
              <ClockAlert size={23} className="text-secondary" />
            </div>

            <h2 className="text-primary-text text-lg font-bold md:text-xl">
              Perhatikan Deadline Tugasmu
            </h2>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3">
            <ClockAlert size={18} className="text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">
              {counts.mendesak} Mendesak
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3">
            <AlertTriangle size={18} className="text-red-600" />
            <span className="text-sm font-semibold text-red-700">
              {counts.terlambat} Terlambat
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskBanner;
