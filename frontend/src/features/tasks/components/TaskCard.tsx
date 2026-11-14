import {
  CalendarDays,
  Check,
  ClipboardList,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

import type { DeadlineState, TaskView } from "../types/type";

interface TaskCardProps {
  task: TaskView;
  toggling: boolean;
  deleting: boolean;
  onEdit: (task: TaskView) => void;
  onDelete: (task: TaskView) => void;
  onToggle: (task: TaskView) => void;
}

const statusStyles: Record<
  DeadlineState,
  { label: string; className: string }
> = {
  mendesak: {
    label: "Mendesak",
    className: "bg-orange-100 text-orange-700",
  },
  terlambat: {
    label: "Terlambat",
    className: "bg-red-100 text-red-700",
  },
  belum: {
    label: "Belum Selesai",
    className: "bg-blue-100 text-blue-700",
  },
  selesai: {
    label: "Selesai",
    className: "bg-emerald-100 text-emerald-700",
  },
};

function formatDeadline(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tanggal tidak valid";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const TaskCard = ({
  task,
  toggling,
  deleting,
  onEdit,
  onDelete,
  onToggle,
}: TaskCardProps) => {
  const status = statusStyles[task.deadlineState];
  const isCompleted = task.status === "selesai";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <svg
        viewBox="0 0 300 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-28 w-64 opacity-25"
      >
        <path
          d="M0 90 C70 25 140 115 220 45 C255 15 280 55 300 25 L300 120 L0 120 Z"
          fill="#D3EAF7"
        />
        <path
          d="M0 110 C90 60 150 125 240 75 C270 60 285 90 300 70 L300 120 L0 120 Z"
          fill="#A9D8EC"
        />
      </svg>

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="bg-secondary-light flex h-12 w-12 items-center justify-center rounded-2xl">
            <ClipboardList size={23} className="text-secondary" />
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className="mt-6 flex-1">
          <h3 className="text-primary-text text-xl font-bold">{task.judul}</h3>
          <p className="text-secondary mt-2 text-sm font-medium">
            {task.mata_kuliah ?? "Mata kuliah tidak diketahui"}
          </p>
          <p className="text-secondary-text mt-4 line-clamp-2 min-h-10 text-sm leading-relaxed">
            {task.deskripsi || "Tidak ada deskripsi tambahan."}
          </p>
        </div>

        <div className="text-secondary-text mt-6 flex items-center gap-2 text-sm">
          <CalendarDays size={18} className="shrink-0" />
          <span>{formatDeadline(task.deadline)}</span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3ECF1] pt-5">
          <button
            type="button"
            disabled={toggling || deleting}
            onClick={() => onToggle(task)}
            className="text-primary hover:text-secondary flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCompleted ? <RotateCcw size={17} /> : <Check size={18} />}

            {toggling
              ? "Memproses..."
              : isCompleted
                ? "Batalkan Selesai"
                : "Tandai Selesai"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Edit tugas ${task.judul}`}
              onClick={() => onEdit(task)}
              disabled={deleting || toggling}
              className="bg-secondary-light text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-[#D3EAF7] disabled:opacity-50"
            >
              <Pencil size={17} />
            </button>

            <button
              type="button"
              aria-label={`Hapus tugas ${task.judul}`}
              onClick={() => onDelete(task)}
              disabled={deleting || toggling}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
