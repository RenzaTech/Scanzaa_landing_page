import React, { useEffect, useRef } from 'react';
import { ECOSYSTEM_DATA } from '../data/scanzaData';
import { ShieldCheck, Store, Smartphone, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  ShieldCheck: ShieldCheck,
  Store: Store,
  Smartphone: Smartphone
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30 text-[#00D2C4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Scanza Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            One Platform. <br />
            <span className="gradient-text-turquoise">Three Experiences.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Scanza connects administration, venue operations, and guest dining into one seamless digital menu ecosystem.
          </p>
        </div>

        {/* Ecosystem 3 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ECOSYSTEM_DATA.map((card, index) => {
            const IconComponent = iconMap[card.iconName] || ShieldCheck;
            
            return (
              <div
                key={card.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group relative glass-card rounded-3xl p-8 border border-[#00D2C4]/15 hover:border-[#00D2C4]/50 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-xl"
              >
                {/* Background Hover Gradient */}
                <div className="absolute -top-24 -right-24 w-56 h-56 bg-[#00D2C4]/10 rounded-full blur-2xl group-hover:bg-[#00D2C4]/20 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#00D2C4]/10 border border-[#00D2C4]/30 flex items-center justify-center text-[#00D2C4] group-hover:bg-[#00D2C4] group-hover:text-[#050808] transition-all duration-300 shadow-md">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold tracking-widest text-[#00D2C4]">
                          CARD {card.id}
                        </span>
                        <div className="text-[11px] font-medium text-[#8B9696]">
                          {card.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00D2C4] transition-colors">
                    {card.title}
                  </h3>
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

                {/* Footer Action */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#00D2C4] group-hover:text-[#80FFF5] transition-colors">
                  <span>Explore {card.title}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
