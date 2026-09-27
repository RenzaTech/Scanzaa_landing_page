import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ScanzaLogo from './ScanzaLogo';

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    const target = document.querySelector('#hero');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050808]/85 backdrop-blur-xl border-b border-[#00D2C4]/15 py-3.5 shadow-2xl shadow-[#050808]/50'
          : 'bg-gradient-to-b from-[#050808]/80 via-[#050808]/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Official SCANZAA Logo */}
        <a 
          href="#hero" 
          onClick={handleLogoClick}
          className="flex items-center gap-2 group"
        >
          <ScanzaLogo size="small" iconOnly={false} />
        </a>

        {/* Right Action: Contact Us */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenContact}
            className="group relative inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-full bg-[#00D2C4] text-[#050808] font-bold text-xs tracking-wide transition-all duration-300 hover:bg-[#80FFF5] hover:shadow-[0_0_25px_rgba(0,210,196,0.4)] glow-turquoise"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </nav>
  );
}
