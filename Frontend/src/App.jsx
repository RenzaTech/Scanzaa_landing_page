import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import ContactModal from './components/ContactModal';

// Pages
import HomePage from './pages/HomePage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Layout wrapper to show global navbar
function AppContent() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleOpenContact = () => {
    setContactModalOpen(true);
  };

  const handleCloseContact = () => {
    setContactModalOpen(false);
  };

  return (
    <>
      <ScrollToTop />

      {/* Global Navigation Bar */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage onOpenContact={handleOpenContact} />} />
        {/* Fallback to Home */}
        <Route path="*" element={<HomePage onOpenContact={handleOpenContact} />} />
      </Routes>

      {/* Global Contact Inquiry Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={handleCloseContact} />
    </>
  );
}

export default function App() {
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <div className="bg-[#050808] min-h-screen text-white font-poppins antialiased selection:bg-[#00D2C4] selection:text-[#050808] relative overflow-x-hidden">
      {/* 1. Splash Screen with Logo Animation */}
      {!splashFinished && (
        <SplashScreen onFinish={() => setSplashFinished(true)} />
      )}

      {/* 2. Continuous Animated Ambient Background */}
      <AnimatedBackground />

      {/* 3. React Router App Content */}
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}
