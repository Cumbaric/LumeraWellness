import Hero from "@/components/home/Hero";
import WelcomeIntro from "@/components/home/WelcomeIntro";
import FeaturedServices from "@/components/home/FeaturedServices";
import GiftVoucher from "@/components/home/GiftVoucher";
import WhyLumera from "@/components/home/WhyLumera";
import FeaturedReview from "@/components/home/FeaturedReview";
import BookingCTA from "@/components/home/BookingCTA";
import { getFeaturedServices } from "@/lib/services";

export const metadata = {
  // Absolute title prevents the root template from duplicating the brand name
  title: { absolute: "Lumera Wellness | Premium Massage & Wellness Studio" },
  description:
    "Relax, recover, and rebalance at Lumera Wellness. Premium massage and wellness treatments in a calm, welcoming space. Book online today.",
  openGraph: {
    title: "Lumera Wellness | Premium Massage & Wellness Studio",
    description:
      "Relax, recover, and rebalance at Lumera Wellness. Premium massage and wellness treatments in a calm, welcoming space. Book online today.",
    url: "https://lumerawellness.vercel.app",
  },
  twitter: {
    title: "Lumera Wellness | Premium Massage & Wellness Studio",
    description:
      "Relax, recover, and rebalance at Lumera Wellness. Premium massage and wellness treatments in a calm, welcoming space. Book online today.",
  },
  alternates: { canonical: "/" },
};

export default async function Home() {
  const featuredServices = await getFeaturedServices();

  return (
    <>
      <Hero />
      <WelcomeIntro />
      <FeaturedServices services={featuredServices} />
      <GiftVoucher />
      <WhyLumera />
      <FeaturedReview />
      <BookingCTA />
    </>
  );
}
