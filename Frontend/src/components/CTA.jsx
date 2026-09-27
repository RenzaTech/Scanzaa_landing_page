import React, { useEffect, useRef } from 'react';
import { ArrowRight, QrCode, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTA({ onOpenContact }) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-32 px-6 overflow-hidden border-b border-white/[0.05]"
    >
      {/* Ambient Video / Image Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600"
          alt="Restaurant ambience"
          className="w-full h-full object-cover filter brightness-50 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050808] via-[#050808]/90 to-[#050808]" />
      </div>

      {/* Turquoise Glow Behind CTA */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#00D2C4]/20 rounded-full blur-[180px] pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 max-w-4xl mx-auto text-center" ref={contentRef}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#00D2C4]/30 backdrop-blur-md mb-8">
          <QrCode className="w-4 h-4 text-[#00D2C4]" />
          <span className="text-xs font-semibold tracking-wider text-[#00D2C4] uppercase">
            Deploy Scanza Today
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Ready to Make Every Table <br />
          <span className="gradient-text-turquoise">Smarter?</span>
        </h2>

        <p className="text-base sm:text-xl text-[#8B9696] max-w-2xl mx-auto leading-relaxed mb-10">
          Bring your restaurant menu into a faster, cleaner digital experience with Scanza.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenContact}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#00D2C4] text-[#050808] font-bold text-sm tracking-wide hover:bg-[#80FFF5] transition-all duration-300 shadow-[0_0_35px_rgba(0,210,196,0.4)] flex items-center justify-center gap-2 group glow-turquoise"
          >
            <span>Contact Scanza</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#features"
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-white/5 border border-white/15 text-white font-medium text-sm hover:bg-white/10 hover:border-[#00D2C4]/40 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
          >
            <span>Explore Features</span>
          </a>
        </div>
      </div>
    </section>
  );
}
