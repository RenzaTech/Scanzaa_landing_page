import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, LockKeyhole } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PremiumCTA({ onOpenContact }) {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
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
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-24 px-6 border-b border-white/[0.05] overflow-hidden"
    >
      {/* Subtle turquoise radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-[#00D2C4]/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10" ref={boxRef}>
        <div className="glass-panel rounded-3xl p-10 sm:p-16 border border-[#00D2C4]/30 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle Corner Ambient */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#00D2C4]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30 text-[#00D2C4] text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scale With ScanzAA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Ready to Unlock the Full <br />
            <span className="gradient-text-turquoise">ScanzAA Experience?</span>
          </h2>

          <p className="text-base sm:text-lg text-[#8B9696] max-w-2xl mx-auto leading-relaxed mb-10">
            Upgrade your restaurant workflow with advanced table management, analytics and service capabilities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenContact}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#00D2C4] text-[#050808] font-bold text-sm tracking-wide hover:bg-[#80FFF5] transition-all duration-300 shadow-[0_0_35px_rgba(0,210,196,0.35)] flex items-center justify-center gap-2 glow-turquoise"
            >
              <span>Upgrade to Premium</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenContact}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/15 text-white font-semibold text-sm hover:bg-white/10 hover:border-[#00D2C4]/40 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Contact ScanzAA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
