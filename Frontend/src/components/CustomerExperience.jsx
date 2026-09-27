import React, { useEffect, useRef } from 'react';
import { Smartphone, Zap, QrCode, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CustomerExperience() {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  const steps = [
    { num: '01', title: 'SCAN QR', desc: 'Point phone camera at the acrylic table QR stand' },
    { num: '02', title: 'OPEN SCANZA', desc: 'Instant browser redirect with zero app installation' },
    { num: '03', title: 'SELECT CATEGORY', desc: 'Browse starters, main course, artisanal drinks' },
    { num: '04', title: 'EXPLORE MENU', desc: 'View vivid dish images, live prices & dietary tags' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(stepsRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
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
      id="customer"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05]"
    >
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[350px] bg-[#00D2C4]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30 text-[#00D2C4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer Scan View</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Built for the Moment <br />
            <span className="gradient-text-turquoise">Customers Sit Down.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Fast, effortless, and beautifully intuitive. Scanza connects diners directly to your live culinary creation.
          </p>
        </div>

        {/* Strong Visual Statement Callout Box */}
        <div className="mb-20 glass-panel rounded-3xl p-8 sm:p-14 border border-[#00D2C4]/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#00D2C4]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#00D2C4]/15 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6">
            No App. <br />
            No Waiting. <br />
            <span className="gradient-text-turquoise">Just Scan.</span>
          </h3>

          <p className="text-base sm:text-lg text-[#8B9696] max-w-2xl mx-auto leading-relaxed">
            Eliminate customer friction, app store downloads, and slow PDF menu downloads. Scanza opens standard mobile HTML menus in less than a second.
          </p>
        </div>

        {/* 4-Step Customer Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.num}
              ref={(el) => (stepsRef.current[index] = el)}
              className="glass-card rounded-2xl p-6 border border-[#00D2C4]/15 hover:border-[#00D2C4]/50 transition-all duration-300 hover:-translate-y-2 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#00D2C4] px-2.5 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30">
                  STEP {step.num}
                </span>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block w-4 h-4 text-[#00D2C4]" />
                )}
              </div>
              <h4 className="text-xl font-bold text-white mb-2 tracking-tight">{step.title}</h4>
              <p className="text-xs text-[#8B9696] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
