import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandStatement from './components/BrandStatement';
import Ecosystem from './components/Ecosystem';
import HowItWorks from './components/HowItWorks';
import RestaurantDashboard from './components/RestaurantDashboard';
import WaiterPortal from './components/WaiterPortal';
import CustomerExperience from './components/CustomerExperience';
import PremiumFeatures from './components/PremiumFeatures';
import PremiumCTA from './components/PremiumCTA';
import Services from './components/Services';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';

export default function App() {
  const [splashFinished, setSplashFinished] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleOpenContact = () => {
    setContactModalOpen(true);
  };

  const handleCloseContact = () => {
    setContactModalOpen(false);
  };

  return (
    <div className="bg-[#050808] min-h-screen text-white font-poppins antialiased selection:bg-[#00D2C4] selection:text-[#050808] relative overflow-x-hidden">
      {/* 1. Splash Screen with Logo Animation */}
      {!splashFinished && (
        <SplashScreen onFinish={() => setSplashFinished(true)} />
      )}

      {/* 2. Continuous Animated Ambient Background */}
      <AnimatedBackground />

      {/* 3. Navigation Bar */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* 4. Fullscreen Video Hero Section */}
      <Hero onOpenContact={handleOpenContact} />

      {/* 5. Section 01: Brand Statement */}
      <BrandStatement />

      {/* 6. Section 02: The ScanzAA Ecosystem (Restaurant Admin, Waiter Portal, Customer Scan View) */}
      <Ecosystem />

      {/* 7. Section 03: How ScanzAA Works (Table to Service in Seconds) */}
      <HowItWorks />

      {/* 8. Section 04: Restaurant Admin Dashboard Mockup */}
      <RestaurantDashboard />

      {/* 9. Section 05: Dedicated Waiter Portal Section */}
      <WaiterPortal />

      {/* 10. Section 06: Customer Scan View (Phone + QR Stand Flow) */}
      <CustomerExperience />

      {/* 11. Section 07: Unlock More With Premium (Locked & Blurred Features) */}
      <PremiumFeatures onOpenContact={handleOpenContact} />

      {/* 12. Section 08: Premium CTA */}
      <PremiumCTA onOpenContact={handleOpenContact} />

      {/* 13. Section 09: Restaurant Services (White-Glove Setup) */}
      <Services onOpenContact={handleOpenContact} />

      {/* 14. Final CTA: Make Every Table Smarter */}
      <CTA onOpenContact={handleOpenContact} />

      {/* 15. Premium Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* 16. Interactive Contact Inquiry Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={handleCloseContact} />
    </div>
  );
}
