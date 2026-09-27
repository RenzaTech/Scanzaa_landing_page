import React, { useEffect, useRef } from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/scanzaData';
import { 
  Building2, UtensilsCrossed, QrCode, MapPin, ScanLine, CheckCircle2, ArrowRight, Sparkles 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  Building2: Building2,
  UtensilsCrossed: UtensilsCrossed,
  QrCode: QrCode,
  MapPin: MapPin,
  ScanLine: ScanLine,
  CheckCircle2: CheckCircle2
};

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(stepsRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
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

  const pipelineNodes = [
    'Restaurant', 'Menu', 'QR Code', 'Table Stand', 'Scan', 'Digital Menu'
  ];

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
            <span>Simple 6-Step Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            From Table to Menu. <br />
            <span className="gradient-text-turquoise">In Seconds.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Designed for instant adoption with zero friction for both restaurant staff and dining guests.
          </p>
        </div>

        {/* Animated Connecting Pipeline Flow Path */}
        <div className="hidden lg:flex items-center justify-between mb-16 p-4 rounded-2xl bg-white/[0.02] border border-[#00D2C4]/20 backdrop-blur-md">
          {pipelineNodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30">
                <span className="w-2 h-2 rounded-full bg-[#00D2C4] glow-turquoise animate-pulse" />
                <span className="text-xs font-semibold text-white tracking-wide">{node}</span>
              </div>
              {idx < pipelineNodes.length - 1 && (
                <div className="flex-1 mx-2 flex items-center justify-center">
                  <div className="h-[2px] w-full bg-gradient-to-r from-[#00D2C4]/40 via-[#00D2C4] to-[#00D2C4]/40 rounded-full" />
                  <ArrowRight className="w-4 h-4 text-[#00D2C4] ml-1 shrink-0" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((item, index) => {
            const IconComp = iconMap[item.iconName] || Building2;
            
            return (
              <div
                key={item.step}
                ref={(el) => (stepsRef.current[index] = el)}
                className="group relative glass-card rounded-3xl p-8 border border-[#00D2C4]/15 hover:border-[#00D2C4]/50 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-[#00D2C4] tracking-wider">
                      STEP {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#00D2C4]/10 border border-[#00D2C4]/30 flex items-center justify-center text-[#00D2C4] group-hover:bg-[#00D2C4] group-hover:text-[#050808] transition-all duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00D2C4] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8B9696] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Progress bar line at bottom of card */}
                <div className="mt-8 pt-4 border-t border-white/10">
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00D2C4] rounded-full transition-all duration-500 group-hover:w-full"
                      style={{ width: `${((index + 1) / 6) * 100}%` }}
                    />
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
