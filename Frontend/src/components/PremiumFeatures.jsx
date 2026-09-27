import React, { useEffect, useRef } from 'react';
import { PREMIUM_FEATURES } from '../data/scanzaData';
import { LockKeyhole, Sparkles, Check, ArrowRight } from 'lucide-react';
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
          stagger: 0.12,
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
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            ScanzAA <span className="gradient-text-turquoise">Premium Suite.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Start with the essentials and unlock advanced restaurant capabilities as your business grows.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {PREMIUM_FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative rounded-3xl border border-white/[0.08] hover:border-[#00D2C4]/50 bg-[#070D0D] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(0,210,196,0.18)] overflow-hidden"
            >
              <div>
                {/* Top: Feature Preview Box (Blurred with Sharp Lock Overlay) */}
                <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6 border border-white/5 bg-[#0A1212]">
                  
                  {/* 1. Blurred Mockup Content (filter: blur(5px), opacity: 0.5) */}
                  <div 
                    className="absolute inset-0 p-3 pointer-events-none select-none flex flex-col justify-between"
                    style={{ filter: 'blur(5px)', opacity: 0.55 }}
                  >
                    <div className="flex items-center justify-between text-[10px] text-white/60 font-mono">
                      <span>{feature.previewData?.badge || 'scanzaa.engine'}</span>
                      <span className="w-2 h-2 rounded-full bg-[#00D2C4]" />
                    </div>
                    
                    {/* Simulated tailored UI based on feature */}
                    <div className="space-y-1.5 my-auto">
                      {feature.id === '01' && (
                        <div className="space-y-1">
                          <div className="p-1.5 bg-[#00D2C4]/20 rounded text-[9px] text-[#00D2C4] font-bold">
                            AI Pick: Truffle Butter Pasta (98% Match)
                          </div>
                          <div className="flex gap-1 text-[8px] text-white/50">
                            <span className="px-1 bg-white/10 rounded">Chef Pairing</span>
                            <span className="px-1 bg-white/10 rounded">Trending</span>
                          </div>
                        </div>
                      )}

                      {feature.id === '02' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-white/80 font-bold">
                            <span>Cart: 3 Dishes</span>
                            <span className="text-[#00D2C4]">₹980</span>
                          </div>
                          <div className="text-[8px] text-emerald-400 bg-emerald-500/10 p-1 rounded font-semibold">
                            Auto-Bill Generated • Table #08
                          </div>
                        </div>
                      )}

                      {feature.id === '03' && (
                        <div className="space-y-1">
                          <div className="flex gap-1 text-[8px]">
                            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded font-bold">Spicy: High</span>
                            <span className="px-1.5 py-0.5 bg-white/10 text-white rounded">No Onions</span>
                          </div>
                          <div className="text-[8px] text-[#00D2C4] font-semibold">
                            Portion: Full • Extra Truffle Crisp
                          </div>
                        </div>
                      )}

                      {feature.id === '04' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-white/80 font-bold">
                            <span>Table #14 (Assigned)</span>
                            <span className="text-amber-400">Order Ready</span>
                          </div>
                          <div className="text-[8px] text-[#00D2C4] bg-[#00D2C4]/10 p-1 rounded font-semibold">
                            KOT Dispatched to Chef Line
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-[9px] text-white/40 font-mono flex justify-between">
                      <span className="truncate">{feature.previewData?.metric}</span>
                      <span className="text-[#00D2C4]">{feature.previewData?.rate}</span>
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

                {/* Middle: Feature Header Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-end mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                      {feature.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-[#00D2C4] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-[#8B9696] leading-relaxed mb-4">
                    "{feature.description}"
                  </p>
                </div>

                {/* Feature Capabilities Checklist */}
                {feature.features && (
                  <div className="space-y-2 mb-6 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase block mb-1">
                      Key Capabilities
                    </span>
                    {feature.features.map((item, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#00D2C4]/20 flex items-center justify-center text-[#00D2C4] mt-0.5 shrink-0">
                          <Check className="w-2 h-2" />
                        </div>
                        <span className="text-xs text-white/80 leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
