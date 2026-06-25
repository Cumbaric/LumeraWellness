import SectionHeading from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

export default function WelcomeIntro() {
  return (
    <Section className="bg-cream">
      <Container>
        <Reveal stagger className="mx-auto max-w-3xl text-center">
          <RevealItem>
            <SectionHeading
              label="Welcome to Lumera"
              title="A calm escape in the heart of the city"
            />
          </RevealItem>
          <RevealItem>
            <p className="-mt-6 text-lg leading-relaxed text-muted">
              Lumera Wellness is a premium massage and wellness studio dedicated to
              restoring balance to body and mind. Every treatment is tailored to
              your needs, delivered with expert care in a serene, welcoming space.
            </p>
          </RevealItem>
        </Reveal>
      </Container>
    </Section>
  );
}
