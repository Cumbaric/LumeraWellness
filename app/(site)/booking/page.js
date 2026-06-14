import { Suspense } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingFlow from "@/components/booking/BookingFlow";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getServices } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Book a Treatment",
  description:
    "Book your massage or wellness treatment at Lumera Wellness in a few simple steps. Choose your treatment, date, and time online.",
  openGraph: {
    title: "Book a Treatment | Lumera Wellness",
    description:
      "Book your massage or wellness treatment at Lumera Wellness in a few simple steps. Choose your treatment, date, and time online.",
    url: "https://lumerawellness.vercel.app/booking",
  },
  twitter: {
    title: "Book a Treatment | Lumera Wellness",
    description:
      "Book your massage or wellness treatment at Lumera Wellness in a few simple steps. Choose your treatment, date, and time online.",
  },
  alternates: { canonical: "/booking" },
};

export default async function BookingPage() {
  const services = await getServices();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const initialDetails = {
    name: user?.user_metadata?.full_name ?? "",
    email: user?.email ?? "",
    phone: user?.user_metadata?.phone ?? "",
    notes: "",
  };

  return (
    <Section className="bg-cream">
      <Container>
        {/* The booking wizard stays centered at a focused, form-friendly width. */}
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <SectionHeading label="Booking" title="Book Your Treatment" />
          </Reveal>

          <Reveal className="mt-4">
            <Suspense
              fallback={<div className="text-center text-muted">Loading…</div>}
            >
              <BookingFlow services={services} initialDetails={initialDetails} />
            </Suspense>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
