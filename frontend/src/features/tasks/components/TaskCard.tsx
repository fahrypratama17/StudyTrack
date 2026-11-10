import type { TaskCardProps} from "../types/type";

/**
 * Memformat deadline menggunakan locale Indonesia.
 * Contoh: 03 Jul 2026, 23.59
 */
function formatDeadline(deadline: string): string {
  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "Tanggal tidak valid";
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Komponen card untuk menampilkan data tugas,
 * status, deadline, dan tindakan pengguna.
 */
export default function TaskCard({task, onToggleStatus, onDelete}: TaskCardProps) {
  const isCompleted = task.status === "selesai";

  return (
    <div className="card task-card">
      <div>
        <strong>{task.judul}</strong>

        <div className="meta">
          {task.mata_kuliah}
        </div>

        <div className="meta">
          Deadline: {formatDeadline(task.deadline)}
        </div>

        {task.deskripsi && (
          <div className="meta">
            {task.deskripsi}
          </div>
        )}
      </div>

      <div style={{ textAlign: "right" }}>
        <span className={`badge ${task.status}`}>
          {isCompleted ? "Selesai" : "Belum"}
        </span>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 8,
          }}
        >
          <button
            type="button"
            className="btn"
            onClick={() => void onToggleStatus(task)}
          >
            {isCompleted
              ? "Tandai Belum"
              : "Tandai Selesai"}
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => void onDelete(task.id)}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}