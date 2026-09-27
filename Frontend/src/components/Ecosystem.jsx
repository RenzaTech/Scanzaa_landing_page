import React, { useEffect, useRef } from 'react';
import { ECOSYSTEM_DATA } from '../data/scanzaData';
import { LayoutDashboard, ConciergeBell, ScanLine, Check, Crown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  LayoutDashboard: LayoutDashboard,
  ConciergeBell: ConciergeBell,
  ScanLine: ScanLine
};

export default function Ecosystem() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
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
      id="ecosystem"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#00D2C4]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#00D2C4]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            One Platform. <br />
            <span className="gradient-text-turquoise">Three Experiences.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            ScanzAA connects your restaurant, service staff and customers through one seamless digital experience.
          </p>
        </div>

        {/* Ecosystem 3 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ECOSYSTEM_DATA.map((card, index) => {
            const IconComponent = iconMap[card.iconName] || LayoutDashboard;
            const isWaiter = card.name === 'Waiter' || card.id === '02';
            
            return (
              <div
                key={card.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`group relative glass-card rounded-3xl p-8 border flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 overflow-hidden ${
                  isWaiter
                    ? 'border-amber-400/25 hover:border-amber-400/80 hover:shadow-[0_0_40px_rgba(245,184,56,0.22)]'
                    : 'border-white/[0.08] hover:border-[#00D2C4] hover:shadow-[0_0_35px_rgba(0,210,196,0.2)]'
                }`}
              >
                {/* Background Hover Gradient */}
                <div
                  className={`absolute -top-24 -right-24 w-56 h-56 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
                    isWaiter
                      ? 'bg-gradient-to-br from-amber-400/10 to-transparent group-hover:from-amber-400/25'
                      : 'bg-gradient-to-br from-[#00D2C4]/10 to-transparent group-hover:from-[#00D2C4]/25'
                  }`}
                />

                {/* Premium Gold Ribbon Gift Tag for Waiter */}
                {isWaiter && (
                  <div className="absolute top-0 right-8 z-20 flex flex-col items-center pointer-events-none group-hover:translate-y-1 transition-transform duration-300">
                    {/* Hanging String / Ribbon Loop */}
                    <div className="w-1.5 h-3.5 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 rounded-t-sm shadow-sm" />
                    
                    {/* Gift Tag Body */}
                    <div
                      className="relative w-14 pt-2 pb-3.5 px-1 bg-gradient-to-b from-[#FFF5B8] via-[#F7BA3E] to-[#B87A0C] text-amber-950 flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(247,186,62,0.45)] border border-[#FFF8CC]"
                      style={{
                        clipPath: 'polygon(18% 0%, 82% 0%, 100% 20%, 100% 100%, 50% 84%, 0% 100%, 0% 20%)',
                      }}
                    >
                      {/* Metallic Punch Hole / Eyelet */}
                      <div className="w-2.5 h-2.5 rounded-full bg-[#050808] border-2 border-amber-200/90 shadow-inner mb-1 flex items-center justify-center" />
                      
                      {/* Crown Icon */}
                      <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-950/25 mb-0.5" />
                      
                      {/* Premium Label */}
                      <span className="text-[8px] font-black tracking-widest uppercase text-amber-950 text-center leading-none">
                        PREMIUM
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${
                        isWaiter
                          ? 'bg-amber-400/10 border border-amber-400/30 text-amber-300 group-hover:bg-amber-400 group-hover:text-black group-hover:scale-105'
                          : 'bg-[#00D2C4]/10 border border-[#00D2C4]/30 text-[#00D2C4] group-hover:bg-[#00D2C4] group-hover:text-[#050808] group-hover:scale-105'
                      }`}>
                        <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold tracking-wider uppercase block ${
                            isWaiter ? 'text-amber-300' : 'text-[#00D2C4]'
                          }`}>
                            {card.name || card.title}
                          </span>
                          {isWaiter && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                              {card.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-medium text-[#8B9696]">
                          {card.subtitle}
                        </div>
                      </div>
                    </div>
                    {!isWaiter && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#8B9696] leading-relaxed mb-6">
                    "{card.description}"
                  </p>

                  {/* Features Bullet List */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <span className="text-xs font-semibold tracking-wider text-white/60 uppercase block mb-2">
                      Key Capabilities
                    </span>
                    {card.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded-full bg-[#00D2C4]/20 flex items-center justify-center text-[#00D2C4] mt-0.5 shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-xs sm:text-sm text-white/90 leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
