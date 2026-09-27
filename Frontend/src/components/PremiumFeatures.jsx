import React, { useEffect, useRef } from 'react';
import { PREMIUM_FEATURES } from '../data/scanzaData';
import { LockKeyhole, Sparkles, ArrowRight, TrendingUp, Grid, Shield, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PremiumFeatures({ onOpenContact }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="premium"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05]"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#00D2C4]/8 rounded-full blur-[220px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30 text-[#00D2C4] text-xs font-semibold uppercase tracking-wider mb-4">
            <LockKeyhole className="w-3.5 h-3.5 text-[#00D2C4]" />
            <span>SCANZAA ENTERPRISE & EXPANSION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Unlock More <br />
            <span className="gradient-text-turquoise">With Premium.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Start with the essentials and unlock advanced restaurant capabilities as your business grows.
          </p>
        </div>

        {/* 8 Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PREMIUM_FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative rounded-3xl border border-white/[0.08] hover:border-[#00D2C4]/50 bg-[#070D0D] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(0,210,196,0.15)] overflow-hidden"
            >
              {/* Top: Feature Preview Box (Blurred with Sharp Lock Overlay) */}
              <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-6 border border-white/5 bg-[#0A1212]">
                
                {/* 1. Blurred Mockup Content (filter: blur(5px), opacity: 0.5) */}
                <div 
                  className="absolute inset-0 p-3 pointer-events-none select-none flex flex-col justify-between"
                  style={{ filter: 'blur(5px)', opacity: 0.55 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/60 font-mono">analytics.scanza.internal</span>
                    <span className="w-2 h-2 rounded-full bg-[#00D2C4]" />
                  </div>
                  
                  {/* Mockup bars / data charts */}
                  <div className="space-y-1.5 my-auto">
                    <div className="flex items-end gap-1.5 h-12">
                      <div className="w-1/6 bg-[#00D2C4]/40 h-[40%] rounded-t" />
                      <div className="w-1/6 bg-[#00D2C4]/70 h-[70%] rounded-t" />
                      <div className="w-1/6 bg-[#00D2C4] h-[95%] rounded-t" />
                      <div className="w-1/6 bg-[#00D2C4]/60 h-[60%] rounded-t" />
                      <div className="w-1/6 bg-[#00D2C4]/80 h-[85%] rounded-t" />
                      <div className="w-1/6 bg-white/40 h-[50%] rounded-t" />
                    </div>
                    <div className="text-[9px] text-[#00D2C4] font-bold truncate">
                      {feature.previewData?.metric || 'Live Data Feed'}
                    </div>
                  </div>

                  <div className="text-[9px] text-white/40 font-mono flex justify-between">
                    <span>STATUS: ACTIVE</span>
                    <span>{feature.previewData?.rate || 'Synced'}</span>
                  </div>
                </div>

                {/* 2. Dark Glass Overlay */}
                <div className="absolute inset-0 bg-[#050808]/60 backdrop-blur-[1px]" />

                {/* 3. Sharp Lock Badge Centerpiece */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                  <div className="w-10 h-10 rounded-2xl bg-[#00D2C4]/15 border border-[#00D2C4]/40 flex items-center justify-center text-[#00D2C4] mb-2 shadow-lg glow-turquoise">
                    <LockKeyhole className="w-5 h-5 text-[#00D2C4]" />
                  </div>
                  <span className="text-[10px] font-extrabold text-[#00D2C4] tracking-widest uppercase">
                    PREMIUM FEATURE
                  </span>
                </div>
              </div>

              {/* Middle: Feature Info */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#8B9696] tracking-widest uppercase">
                    FEATURE {feature.number}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                    {feature.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-[#00D2C4] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#8B9696] leading-relaxed mb-6 flex-1">
                  "{feature.description}"
                </p>
              </div>

              {/* Bottom: Upgrade to Unlock Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={onOpenContact}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-[#00D2C4]/30 text-[#00D2C4] hover:bg-[#00D2C4] hover:text-[#050808] font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md group-hover:border-[#00D2C4]"
                >
                  <LockKeyhole className="w-3.5 h-3.5" />
                  <span>Upgrade to Unlock</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
