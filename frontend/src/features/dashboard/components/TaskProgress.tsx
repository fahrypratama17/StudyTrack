import { useDashboard } from "../hooks/useDashboard";

const TaskProgress = () => {
  const { summary } = useDashboard();

  return (
    <div className="rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm md:p-8">
      <div className="mb-7">
        <h3 className="text-primary-text text-xl font-bold">Progres Tugas</h3>
        <p className="text-secondary-text mt-1 text-sm">
          Ringkasan penyelesaian tugas kuliahmu.
        </p>
      </div>

      <div className="flex justify-center">
        <div
          role="progressbar"
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
            <span className="text-secondary-text mt-1 text-sm">Selesai</span>
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
          <p className="text-2xl font-bold text-[#C77B3B]">{summary.pending}</p>
          <p className="mt-1 text-xs text-[#C77B3B]">Belum Selesai</p>
        </div>
      </div>
    </div>
  );
};

export default TaskProgress;
