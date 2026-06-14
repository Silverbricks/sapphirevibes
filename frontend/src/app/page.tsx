import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { HomeHero } from '@/components/home/HomeHero';
import { TrustBar } from '@/components/home/TrustBar';
import { LuxuryCollections } from '@/components/home/LuxuryCollections';
import { FeaturedPieces } from '@/components/home/FeaturedPieces';
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HomeHero />
        <TrustBar />
        <LuxuryCollections />
        <FeaturedPieces />
        <TestimonialCarousel />
        <NewsletterSignup />
      </main>
      <SiteFooter />
    </>
  );
}
