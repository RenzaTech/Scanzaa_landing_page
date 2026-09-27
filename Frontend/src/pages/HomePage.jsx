import React from 'react';
import Hero from '../components/Hero';
import BrandStatement from '../components/BrandStatement';
import Ecosystem from '../components/Ecosystem';
import HowItWorks from '../components/HowItWorks';
import PremiumFeatures from '../components/PremiumFeatures';
import PremiumCTA from '../components/PremiumCTA';
import Services from '../components/Services';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function HomePage({ onOpenContact }) {
  return (
    <>
      {/* 1. Fullscreen Video Hero Section */}
      <Hero onOpenContact={onOpenContact} />

      {/* 2. Section 01: Brand Statement */}
      <BrandStatement />

      {/* 3. Section 02: The ScanzAA Ecosystem (Restaurant Admin, Waiter Portal, Customer Scan View cards) */}
      <Ecosystem />

      {/* 4. Section 03: How ScanzAA Works (Table to Service in Seconds) */}
      <HowItWorks />

      {/* 5. Section 07: Unlock More With Premium (Locked & Blurred Features) */}
      <PremiumFeatures onOpenContact={onOpenContact} />

      {/* 6. Section 08: Premium CTA */}
      <PremiumCTA onOpenContact={onOpenContact} />

      {/* 7. Section 09: Restaurant Services (White-Glove Setup) */}
      <Services onOpenContact={onOpenContact} />

      {/* 8. Final CTA: Make Every Table Smarter */}
      <CTA onOpenContact={onOpenContact} />

      {/* 9. Premium Footer */}
      <Footer onOpenContact={onOpenContact} />
    </>
  );
}
