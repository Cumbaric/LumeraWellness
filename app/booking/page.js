import { Suspense } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingFlow from "@/components/booking/BookingFlow";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "Book a Treatment | Lumera Wellness",
  description:
    "Book your massage or wellness treatment at Lumera in a few simple steps — choose a treatment, date, and time that suit you.",
};

export default function BookingPage() {
  return (
    <Section className="bg-cream">
      <Container>
        {/* The booking wizard stays centered at a focused, form-friendly width. */}
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionHeading label="Booking" title="Book Your Treatment" />
          </div>

          <div className="mt-4">
            <Suspense
              fallback={<div className="text-center text-muted">Loading…</div>}
            >
              <BookingFlow />
            </Suspense>
          </div>
        </div>
      </Container>
    </Section>
  );
}
