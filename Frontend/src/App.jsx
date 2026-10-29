import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import SiteChrome, { PageIntro } from './components/SiteChrome';
import HomePage from './pages/HomePage';

gsap.registerPlugin(ScrollTrigger);

const LENIS_LERP = 0.22;
const LENIS_WHEEL_MULTIPLIER = 1.15;

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis;
    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time) => lenis?.raf(time * 1000);

    const syncScroll = () => {
      if (lenis) {
        lenis.off('scroll', updateScrollTrigger);
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenis = undefined;
      }

      if (!motionPreference.matches) {
        lenis = new Lenis({
          autoRaf: false,
          lerp: LENIS_LERP,
          smoothWheel: true,
          wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
          syncTouch: false,
          anchors: { offset: -88 },
        });
        lenis.on('scroll', updateScrollTrigger);
        gsap.ticker.add(tick);
      }
    };

    gsap.ticker.lagSmoothing(0);
    syncScroll();
    motionPreference.addEventListener('change', syncScroll);
    return () => {
      motionPreference.removeEventListener('change', syncScroll);
      if (lenis) {
        lenis.off('scroll', updateScrollTrigger);
        gsap.ticker.remove(tick);
      }
      lenis?.destroy();
    };
  }, []);

  return null;
}

// Layout wrapper to show global navbar
function AppContent() {
  const handleOpenContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      <ScrollToTop />

      {/* Global Navigation Bar */}
      <Navbar onOpenContact={handleOpenContact} />
      <SiteChrome />
      <PageIntro />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage onOpenContact={handleOpenContact} />} />
        {/* Fallback to Home */}
        <Route path="*" element={<HomePage onOpenContact={handleOpenContact} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#101412] text-[#f3f0e8] antialiased selection:bg-[#FCC133] selection:text-[#171411]">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}
