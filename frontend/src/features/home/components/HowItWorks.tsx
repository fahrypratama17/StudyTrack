import { steps } from "../data/data";

const HowItWorks = () => {
  return (
    <section id="cara-kerja" className="mx-auto max-w-375 px-8 py-20">
      <div className="mb-14 text-center">
        <h2 className="text-primary-text mt-6 text-4xl font-bold">
          Bagaimana Cara Kerjanya?
        </h2>

        <p className="text-secondary-text mx-auto mt-4 max-w-xl text-lg">
          Cukup empat langkah sederhana untuk mulai mengelola tugas kuliahmu
          bersama StudyTrack.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <article
              key={step.id}
              className="group rounded-3xl border border-[#E3ECF1] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="bg-secondary-light rounded-2xl p-4">
                  <Icon size={28} className="text-secondary" />
                </div>
              </div>

              <h3 className="text-primary-text mt-8 text-xl font-bold">
                {step.title}
              </h3>

              <p className="text-secondary-text mt-3 leading-relaxed">
                {step.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
