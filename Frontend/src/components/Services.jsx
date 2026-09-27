import React, { useEffect, useRef } from 'react';
import { SERVICE_CARDS } from '../data/scanzaData';
import { FileCheck, Maximize2, Headphones, Sparkles, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  FileCheck: FileCheck,
  Maximize2: Maximize2,
  Headphones: Headphones,
  Sparkles: Sparkles
};

export default function Services({ onOpenContact }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
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
      id="services"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05]"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#00D2C4]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Dedicated <span className="gradient-text-turquoise">Deployment.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            From initial menu digitization to custom QR table setups, ScanzAA handles your complete restaurant onboarding.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_CARDS.map((service, index) => {
            const IconComp = iconMap[service.iconName] || FileCheck;

            return (
              <div
                key={service.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group glass-card rounded-3xl p-7 border border-white/[0.08] hover:border-[#00D2C4]/50 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#00D2C4]/10 border border-[#00D2C4]/30 flex items-center justify-center text-[#00D2C4] mb-6 group-hover:bg-[#00D2C4] group-hover:text-[#050808] transition-all duration-300 shadow-md">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-bold text-[#00D2C4] tracking-widest uppercase block mb-1">
                    SERVICE {service.id}
                  </span>

                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-[#00D2C4] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#8B9696] leading-relaxed mb-6">
                    "{service.description}"
                  </p>
                </div>

                {/* Contact Us Action on each card */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={onOpenContact}
                    className="w-full text-left flex items-center justify-between text-xs font-semibold text-[#00D2C4] group-hover:text-[#80FFF5] transition-colors py-1"
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
