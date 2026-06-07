import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyLumera from "@/components/home/WhyLumera";
import FeaturedReview from "@/components/home/FeaturedReview";
import BookingCTA from "@/components/home/BookingCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <WhyLumera />
      <FeaturedReview />
      <BookingCTA />
    </>
  );
}
