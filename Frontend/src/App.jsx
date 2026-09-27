import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandStatement from './components/BrandStatement';
import Features from './components/Features';
import QRExperience from './components/QRExperience';
import RestaurantDashboard from './components/RestaurantDashboard';
import CustomerExperience from './components/CustomerExperience';
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

      {/* 5. Brand Statement */}
      <BrandStatement />

      {/* 6. Premium Features */}
      <Features />

      {/* 7. Interactive QR Experience */}
      <QRExperience />

      {/* 10. Restaurant Admin Dashboard */}
      <RestaurantDashboard />

      {/* 11. Customer Experience */}
      <CustomerExperience />

      {/* 12. Premium Services */}
      <Services onOpenContact={handleOpenContact} />

      {/* 13. Restaurant CTA */}
      <CTA onOpenContact={handleOpenContact} />

      {/* 14. Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* 15. Interactive Contact Inquiry Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={handleCloseContact} />
    </div>
  );
}
