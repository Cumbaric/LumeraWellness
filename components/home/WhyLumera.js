import SectionHeading from "@/components/ui/SectionHeading";

const values = [
  {
    title: "Expert Therapists",
    description:
      "Certified, experienced therapists who tailor every session to your body and needs.",
    icon: "✦",
  },
  {
    title: "Calming Atmosphere",
    description:
      "A serene, thoughtfully designed space made for switching off and slowing down.",
    icon: "❀",
  },
  {
    title: "Personalized Care",
    description:
      "Every treatment begins with you — your goals, your comfort, your pace.",
    icon: "♡",
  },
];

export default function WhyLumera() {
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionHeading label="Why Lumera" title="A considered experience" />
        <p className="mx-auto -mt-6 mb-12 max-w-2xl text-center text-muted">
          More than a massage — a calm, considered experience from the moment
          you arrive.
        </p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl bg-cream p-8 ring-1 ring-sand"
            >
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-xl text-sage-dark"
              >
                {value.icon}
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-charcoal">
                {value.title}
              </h3>
              <p className="mt-3 text-sm text-muted">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
