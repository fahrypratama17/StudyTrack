import { CircleCheck } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  initials: string;
}

const ProfileHeader = ({ name, email, initials }: ProfileHeaderProps) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm md:p-8">
      <svg
        viewBox="0 0 600 220"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-full w-[65%] opacity-45"
      >
        <path
          d="M0 185 C110 85 200 210 320 105 C420 25 510 125 600 45 L600 220 L0 220 Z"
          fill="#D3EAF7"
        />

        <path
          d="M0 210 C130 145 245 225 365 165 C475 105 545 180 600 130 L600 220 L0 220 Z"
          fill="#A9D8EC"
        />
      </svg>

      <div className="relative z-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="bg-primary flex h-22 w-22 shrink-0 items-center justify-center rounded-full border-4 border-white text-2xl font-bold text-white shadow-md">
          {initials || "ST"}
        </div>

        <div className="min-w-0">
          <p className="text-secondary-text text-sm">Akun StudyTrack</p>
          <h2 className="text-primary-text mt-1 text-2xl font-bold break-words md:text-3xl">
            {name || "Pengguna StudyTrack"}
          </h2>
          <p className="text-secondary-text mt-2 text-sm break-all">
            {email || "Email tidak tersedia"}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E4F5EF] px-3 py-1.5 text-xs font-semibold text-[#168567]">
            <CircleCheck size={15} />
            Akun aktif
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
