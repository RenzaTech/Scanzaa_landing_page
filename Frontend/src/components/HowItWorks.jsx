import React, { useEffect, useRef } from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/scanzaData';
import { 
  UtensilsCrossed, QrCode, MapPin, ScanLine, Smartphone, ConciergeBell, ArrowRight, Sparkles 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  UtensilsCrossed: UtensilsCrossed,
  QrCode: QrCode,
  MapPin: MapPin,
  ScanLine: ScanLine,
  Smartphone: Smartphone,
  ConciergeBell: ConciergeBell
};

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress line animation
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              end: 'bottom 85%',
              scrub: 1,
            }
          }
        );
      }

      // Step cards stagger
      gsap.fromTo(stepsRef.current,
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
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
      id="how-it-works"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05]"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#00D2C4]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30 text-[#00D2C4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>How ScanzAA Works</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            From Table to Service. <br />
            <span className="gradient-text-turquoise">In Seconds.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Designed for instant adoption with zero friction for restaurant staff and dining guests.
          </p>
        </div>

        {/* Desktop Horizontal Process Timeline Progress Bar */}
        <div className="hidden lg:block relative mb-12">
          {/* Track line */}
          <div className="h-[2px] w-full bg-white/10 rounded-full" />
          {/* Animated fill line */}
          <div 
            ref={lineRef}
            className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#00D2C4]/40 via-[#00D2C4] to-[#00D2C4] origin-left rounded-full glow-turquoise"
          />
        </div>

        {/* 6 Steps Grid: Horizontal on Desktop, Vertical on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((item, index) => {
            const IconComp = iconMap[item.iconName] || UtensilsCrossed;
            
            return (
              <div
                key={item.step}
                ref={(el) => (stepsRef.current[index] = el)}
                className="group relative glass-card rounded-3xl p-7 border border-white/[0.08] hover:border-[#00D2C4]/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle turquoise backdrop glow on hover */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#00D2C4]/10 rounded-full blur-xl group-hover:bg-[#00D2C4]/20 transition-all duration-300 pointer-events-none" />

                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-extrabold text-[#00D2C4] tracking-widest px-3 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30">
                      STEP {item.step}
                    </span>

                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-[#00D2C4] group-hover:text-[#050808] group-hover:border-[#00D2C4] transition-all duration-300 shadow-md">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-[#00D2C4] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8B9696] leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                {/* Details Pills */}
                {item.details && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                    {item.details.map((detail, dIdx) => (
                      <span 
                        key={dIdx} 
                        className="text-[10px] font-medium text-white/70 bg-white/5 px-2 py-0.5 rounded-md border border-white/5"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
