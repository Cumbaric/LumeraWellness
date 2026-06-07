import Hero from "@/components/home/Hero";
import WelcomeIntro from "@/components/home/WelcomeIntro";
import FeaturedServices from "@/components/home/FeaturedServices";
import GiftVoucher from "@/components/home/GiftVoucher";
import WhyLumera from "@/components/home/WhyLumera";
import FeaturedReview from "@/components/home/FeaturedReview";
import BookingCTA from "@/components/home/BookingCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <WelcomeIntro />
      <FeaturedServices />
      <GiftVoucher />
      <WhyLumera />
      <FeaturedReview />
      <BookingCTA />
    </>
  );
}
