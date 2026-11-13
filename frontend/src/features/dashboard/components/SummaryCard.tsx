import type { LucideIcon } from "lucide-react";

type CardTone = "blue" | "purple" | "orange" | "red";

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  tone: CardTone;
}

const toneStyles = {
  blue: "bg-[#E6F3FB] text-[#0D6684]",
  purple: "bg-[#F0EBFF] text-[#7964C8]",
  orange: "bg-[#FFF0E5] text-[#C77B3B]",
  red: "bg-[#FCE9EB] text-[#BD5463]",
};

const SummaryCard = ({
  title,
  value,
  description,
  icon: Icon,
  tone,
}: SummaryCardProps) => {
  return (
    <article className="rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${toneStyles[tone]}`}
      >
        <Icon size={26} strokeWidth={1.8} />
      </div>

      <div className="mt-6">
        <p className="text-secondary-text text-sm font-medium">{title}</p>

        <h3 className="text-primary-text mt-2 text-4xl font-bold">{value}</h3>

        <p className="text-secondary-text mt-3 text-sm">{description}</p>
      </div>
    </article>
  );
};

export default SummaryCard;
