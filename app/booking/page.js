import { Suspense } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingFlow from "@/components/booking/BookingFlow";

export const metadata = {
  title: "Book a Treatment | Lumera Wellness",
  description:
    "Book your massage or wellness treatment at Lumera in a few simple steps — choose a treatment, date, and time that suit you.",
};

export default function BookingPage() {
  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
        <SectionHeading label="Booking" title="Book Your Treatment" />
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-20 sm:pb-24">
        <Suspense fallback={<div className="text-center text-muted">Loading…</div>}>
          <BookingFlow />
        </Suspense>
      </div>
    </div>
  );
}
