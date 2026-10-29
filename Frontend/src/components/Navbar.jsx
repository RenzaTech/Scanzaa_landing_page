import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

const links = [
  ['Platform', '#product'],
  ['How it works', '#how-it-works'],
  ['Guest menu', '#menu-preview'],
  ['FAQs', '#faq'],
];

function BrandMark() {
  return (
    <a href="#hero" className="inline-flex min-h-11 items-center gap-2.5" aria-label="Scanzaa home">
      <img src="/images/scanza-s-icon.png" alt="" className="h-8 w-8 object-contain brightness-0 invert" />
      <span className="text-[17px] font-extrabold tracking-[-0.06em] text-[#f6f3eb]">
        SCAN<span className="text-[#FCC133]">ZAA</span>
      </span>
    </a>
  );
}

export default function Navbar({ onOpenContact }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const menuOpenRef = useRef(false);

  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const currentY = window.scrollY;
        setIsScrolled(currentY > 12);
        if (menuOpenRef.current || currentY < 96) {
          setIsHidden(false);
        } else if (Math.abs(currentY - previousY) > 2) {
          setIsHidden(currentY > previousY);
        }
        previousY = currentY;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        menuOpenRef.current = false;
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    menuOpenRef.current = false;
    setIsMenuOpen(false);
  };
  const toggleMenu = () => {
    menuOpenRef.current = !menuOpenRef.current;
    setIsMenuOpen(menuOpenRef.current);
    if (menuOpenRef.current) setIsHidden(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] border-b transition-[background-color,border-color,transform,backdrop-filter] duration-500 ${
        isHidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
      } ${
        isScrolled || isMenuOpen
          ? 'border-white/10 bg-[#101412]/75 shadow-[0_12px_42px_-32px_rgba(0,0,0,0.9)] backdrop-blur-2xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="relative z-[60] mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:h-[82px] sm:px-8">
        <BrandMark />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="flex min-h-11 items-center text-sm font-medium text-white/70 transition hover:text-[#FCC133]"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-magnetic
            onClick={() => {
              closeMenu();
              onOpenContact();
            }}
            className="premium-button hidden min-h-11 items-center gap-3 rounded-full border border-[#FCC133] bg-[#FCC133] px-5 text-xs font-bold uppercase tracking-[0.1em] text-[#183b34] transition hover:bg-[#ffd45e] lg:inline-flex"
          >
            <span>Talk to our team</span> <ArrowRight size={15} />
          </button>
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={toggleMenu}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white lg:hidden"
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-navigation lg:hidden">
          <div className="mobile-navigation__links">
            {links.map(([label, href], index) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                style={{ '--link-index': index }}
                className="mobile-navigation__link"
              >
                <span>{label}</span><ArrowRight size={19} aria-hidden="true" />
              </a>
            ))}
            <button
              type="button"
              data-magnetic
              onClick={() => {
                closeMenu();
                onOpenContact();
              }}
              className="premium-button mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#FCC133] bg-[#FCC133] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#183b34]"
            >
              <span>Talk to our team</span><ArrowRight size={15} />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
