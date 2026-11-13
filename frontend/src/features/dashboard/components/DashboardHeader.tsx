import { CalendarDays } from "lucide-react";

const DashboardHeader = () => {
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
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
  );
};

export default DashboardHeader;