import { CircleCheck, UserRound } from "lucide-react";
import ProfileWave from "./ProfileWave";

interface ProfileHeaderProps {
  name: string;
  email: string;
  initials: string;
}

const ProfileHeader = ({ name, email, initials }: ProfileHeaderProps) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm md:p-8">
      <ProfileWave />

      <div className="relative z-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="bg-primary flex h-22 w-22 shrink-0 items-center justify-center rounded-full border-4 border-white text-2xl font-bold text-white shadow-md">
          {initials || <UserRound className="size-10" width={32} />}
        </div>

        <div className="min-w-0">
          <h2 className="text-primary-text mt-1 text-2xl font-bold break-words md:text-3xl">
            {name || "Pengguna StudyTrack"}
          </h2>
          <p className="text-secondary-text mt-2 text-sm break-all">
            {email || "Email tidak tersedia"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
