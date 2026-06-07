import SectionHeading from "@/components/ui/SectionHeading";

export default function WelcomeIntro() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
        <SectionHeading
          label="Welcome to Lumera"
          title="A calm escape in the heart of the city"
        />
        <p className="-mt-6 text-lg leading-relaxed text-muted">
          Lumera Wellness is a premium massage and wellness studio dedicated to
          restoring balance to body and mind. Every treatment is tailored to
          your needs, delivered with expert care in a serene, welcoming space.
        </p>
      </div>
    </section>
  );
}
