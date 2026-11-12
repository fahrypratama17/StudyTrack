import { benefits } from "../data/data";

const Benefits = () => {
  return (
    <section id="manfaat" className="mx-auto max-w-375 px-8 py-20">
      <div className="mb-14 text-center">
        <h2 className="text-primary-text text-4xl font-bold">
          Kenapa Memilih StudyTrack?
        </h2>

        <p className="text-secondary-text mx-auto mt-4 max-w-2xl text-lg">
          Nikmati kemudahan mengelola tugas dan aktivitas perkuliahan dalam satu
          tempat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <article
              key={benefit.title}
              style={{ backgroundColor: benefit.bgColor }}
              className="group rounded-3xl border border-[#E3ECF1] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80">
                <Icon size={28} style={{ color: benefit.iconColor }} />
              </div>
              <h3 className="text-primary-text mt-8 text-xl font-bold">
                {benefit.title}
              </h3>
              <p className="text-secondary-text mt-3 line-clamp-3 leading-relaxed">
                {benefit.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Benefits;
