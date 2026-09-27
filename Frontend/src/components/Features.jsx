import React, { useEffect, useRef } from 'react';
import { FEATURES_DATA } from '../data/scanzaData';
import { 
  LayoutGrid, ToggleRight, RefreshCw, QrCode, 
  Sliders, Sparkles, TrendingUp, Palette, CheckCircle2, Eye, Zap, Shield 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  LayoutGrid: LayoutGrid,
  ToggleRight: ToggleRight,
  RefreshCw: RefreshCw,
  QrCode: QrCode,
  Sliders: Sliders,
  Sparkles: Sparkles,
  TrendingUp: TrendingUp,
  Palette: Palette
};

export default function Features() {
  const sectionRef = useRef(null);
  const featureRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      featureRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30 text-[#00D2C4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Platform Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            More Than Just a <span className="gradient-text-turquoise">QR Code.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Scanza gives restaurants a complete digital menu infrastructure to control every table interaction.
          </p>
        </div>

        {/* Feature Cards in Alternating Layouts */}
        <div className="space-y-12">
          {FEATURES_DATA.map((feat, index) => {
            const IconComp = iconMap[feat.iconName] || LayoutGrid;
            const isEven = index % 2 === 0;

            return (
              <div
                key={feat.number}
                ref={(el) => (featureRefs.current[index] = el)}
                className={`glass-card rounded-3xl p-8 sm:p-12 border border-[#00D2C4]/15 hover:border-[#00D2C4]/40 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content Side */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-extrabold text-[#00D2C4]/50 tracking-wider">
                      {feat.number}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#00D2C4]/10 text-[#00D2C4] border border-[#00D2C4]/20">
                      {feat.highlight}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00D2C4]/15 border border-[#00D2C4]/30 flex items-center justify-center text-[#00D2C4]">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-4">
                    "{feat.description}"
                  </p>

                  <p className="text-xs sm:text-sm text-[#8B9696] leading-relaxed">
                    {feat.detail}
                  </p>
                </div>

                {/* Visual Preview Side */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative rounded-2xl bg-[#0A1111] border border-white/10 p-6 shadow-2xl overflow-hidden group">
                    {/* Glowing background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00D2C4]/10 rounded-full blur-2xl group-hover:bg-[#00D2C4]/20 transition-all duration-500 pointer-events-none" />

                    {/* Dynamic Graphic UI Preview per Feature */}
                    <div className="relative z-10 space-y-4">
                      {index === 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-white/70 pb-2 border-b border-white/10">
                            <span className="font-semibold text-[#00D2C4]">Category: Starters</span>
                            <span>4 Items</span>
                          </div>
                          <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#00D2C4]/20 border border-[#00D2C4]/40 flex items-center justify-center text-[#00D2C4] font-bold text-xs">
                                01
                              </div>
                              <span className="text-xs font-semibold text-white">Crispy Truffle Fries</span>
                            </div>
                            <span className="text-xs font-bold text-[#00D2C4]">₹320</span>
                          </div>
                        </div>
                      )}

                      {index === 1 && (
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                          <div>
                            <span className="text-xs font-semibold text-white block">Smoked Mutton Dum Biryani</span>
                            <span className="text-[11px] text-amber-400 font-medium">Currently Sold Out</span>
                          </div>
                          <div className="w-12 h-6 rounded-full bg-red-500/20 border border-red-500/40 p-0.5 flex items-center justify-start cursor-pointer">
                            <div className="w-5 h-5 rounded-full bg-red-500" />
                          </div>
                        </div>
                      )}

                      {index === 2 && (
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">Price Edit: Wood-Fired Burrata</span>
                            <span className="text-emerald-400 font-bold">Updated Now</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="line-through text-white/40">₹520</span>
                            <span className="text-[#00D2C4] font-bold">₹490</span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Live on 24 Tables</span>
                          </div>
                        </div>
                      )}

                      {index === 3 && (
                        <div className="flex items-center justify-around p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-center">
                            <QrCode className="w-12 h-12 text-[#00D2C4] mx-auto mb-1" />
                            <span className="text-[10px] text-white/70">Table #12 Vector QR</span>
                          </div>
                          <div className="text-xs space-y-1 text-white/80">
                            <div>• Vector SVG/PNG</div>
                            <div>• Acrylic Stand Ready</div>
                            <div>• Table Specific ID</div>
                          </div>
                        </div>
                      )}

                      {index >= 4 && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#00D2C4]/20 flex items-center justify-center text-[#00D2C4]">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{feat.title} Engine</span>
                            <span className="text-[11px] text-[#8B9696]">{feat.highlight} • Optimized for Scanza</span>
                          </div>
                        </div>
                      )}
                    </div>
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
