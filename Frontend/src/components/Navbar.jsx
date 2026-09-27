import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import ScanzaLogo from './ScanzaLogo';
import { NAV_LINKS } from '../data/scanzaData';

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
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
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-2 group"
        >
          <ScanzaLogo size="small" iconOnly={false} />
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xs font-medium text-white/80 hover:text-[#00D2C4] transition-colors tracking-wide py-1 relative group"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00D2C4] rounded-full transition-all duration-300 group-hover:w-full glow-turquoise" />
            </a>
          ))}
        </div>

        {/* Right Action: Contact Us & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenContact}
            className="group relative inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-full bg-[#00D2C4] text-[#050808] font-bold text-xs tracking-wide transition-all duration-300 hover:bg-[#80FFF5] hover:shadow-[0_0_25px_rgba(0,210,196,0.4)] glow-turquoise"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#00D2C4] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050808]/95 backdrop-blur-2xl border-b border-[#00D2C4]/20 px-6 py-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block text-sm font-semibold text-white/90 hover:text-[#00D2C4] py-2 border-b border-white/5"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-3 rounded-full bg-[#00D2C4] text-[#050808] font-bold text-xs tracking-wide flex items-center justify-center gap-2 glow-turquoise"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
