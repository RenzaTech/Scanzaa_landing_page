import React, { useState, useEffect, useRef } from 'react';
import { DEMO_MENU_ITEMS } from '../data/scanzaData';
import { 
  QrCode, Search, Smartphone, Sparkles, ArrowRight, 
  Check, ChevronRight, Zap, CheckCircle2 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CustomerExperience() {
  const sectionRef = useRef(null);
  const flowRef = useRef(null);
  const leftQrRef = useRef(null);
  const phoneRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Starters', 'Main Course', 'Biryani', 'Beverages', 'Desserts'];

  const filteredItems = DEMO_MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Flow banner animation
      gsap.fromTo(flowRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Left QR stand
      gsap.fromTo(leftQrRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );

      // Phone slide in from right
      gsap.fromTo(phoneRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.2,
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
      id="customer"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05] overflow-hidden"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#00D2C4]/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30 text-[#00D2C4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer Scan View</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            One Scan. <br />
            <span className="gradient-text-turquoise">Instant Menu.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Customers simply scan the QR code on their table and instantly access the restaurant's digital menu in their browser.
          </p>

          {/* Highlight Badge: No App Required */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No App Required. 100% Web-Based Browser Speed.</span>
          </div>
        </div>

        {/* Visual Flow Banner: QR CODE -> SCAN -> DIGITAL MENU */}
        <div 
          ref={flowRef}
          className="max-w-2xl mx-auto mb-16 p-4 rounded-2xl bg-[#070D0D] border border-[#00D2C4]/25 flex items-center justify-between gap-2 sm:gap-4 shadow-xl text-center"
        >
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00D2C4]/10 border border-[#00D2C4]/30 flex items-center justify-center text-[#00D2C4]">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">QR CODE</span>
          </div>

          <ArrowRight className="w-4 h-4 text-[#00D2C4] shrink-0" />

          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00D2C4]/10 border border-[#00D2C4]/30 flex items-center justify-center text-[#00D2C4]">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#00D2C4] tracking-wide">SCAN</span>
          </div>

          <ArrowRight className="w-4 h-4 text-[#00D2C4] shrink-0" />

          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00D2C4]/10 border border-[#00D2C4]/30 flex items-center justify-center text-[#00D2C4]">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">DIGITAL MENU</span>
          </div>
        </div>

        {/* Showcase Grid: QR Stand Left, Smartphone Mockup Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: QR Code Acrylic Stand */}
          <div ref={leftQrRef} className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm glass-panel rounded-3xl p-8 border border-[#00D2C4]/30 shadow-2xl flex flex-col items-center text-center group">
              <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="text-xs font-semibold text-[#8B9696] tracking-wider uppercase">Table #08</span>
                <span className="text-xs font-bold text-[#00D2C4] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D2C4] animate-ping" /> SCANZAA ACTIVE
                </span>
              </div>

              {/* ScanzAA QR Visual */}
              <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(0,210,196,0.3)] mb-6 transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 100 100" className="w-48 h-48 sm:w-56 sm:h-56">
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="28" height="28" fill="#050808" rx="4" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="#00D2C4" rx="2" />

                  <rect x="67" y="5" width="28" height="28" fill="#050808" rx="4" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="#00D2C4" rx="2" />

                  <rect x="5" y="67" width="28" height="28" fill="#050808" rx="4" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="#00D2C4" rx="2" />

                  {/* Matrix modules */}
                  <rect x="38" y="8" width="6" height="6" fill="#050808" />
                  <rect x="48" y="12" width="6" height="6" fill="#050808" />
                  <rect x="56" y="8" width="6" height="6" fill="#050808" />

                  <rect x="8" y="38" width="6" height="6" fill="#050808" />
                  <rect x="20" y="44" width="6" height="6" fill="#050808" />
                  <rect x="28" y="38" width="6" height="6" fill="#050808" />

                  <rect x="38" y="38" width="8" height="8" fill="#00D2C4" />
                  <rect x="52" y="38" width="8" height="8" fill="#050808" />
                  <rect x="44" y="50" width="12" height="12" fill="#050808" rx="2" />
                  <circle cx="50" cy="56" r="3" fill="#00D2C4" />

                  <rect x="68" y="42" width="6" height="6" fill="#050808" />
                  <rect x="80" y="48" width="8" height="6" fill="#050808" />
                  <rect x="88" y="40" width="6" height="6" fill="#050808" />

                  <rect x="38" y="68" width="6" height="6" fill="#050808" />
                  <rect x="48" y="74" width="6" height="6" fill="#050808" />
                  <rect x="58" y="80" width="8" height="6" fill="#050808" />
                  <rect x="70" y="70" width="8" height="8" fill="#050808" />
                  <rect x="82" y="78" width="10" height="10" fill="#00D2C4" rx="2" />
                </svg>
              </div>

              <h4 className="text-lg font-bold text-white mb-1">Scan for Digital Menu</h4>
              <p className="text-xs text-[#8B9696] max-w-xs mb-4">
                Point your standard smartphone camera. Opens instantly with zero downloads.
              </p>

              <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#8B9696]">
                <span>No app installation</span>
                <span className="text-[#00D2C4] font-semibold">Sub-second Speed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Smartphone Mockup */}
          <div ref={phoneRef} className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-md bg-[#050808] border-[8px] border-[#1A2626] rounded-[48px] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(0,210,196,0.2)] overflow-hidden">
              
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10 mr-2" />
                <div className="w-2 h-2 rounded-full bg-[#00D2C4]/40" />
              </div>

              {/* Phone Screen Container */}
              <div className="h-[640px] overflow-y-auto bg-[#070D0D] text-white flex flex-col scrollbar-thin scrollbar-thumb-white/10">
                
                {/* Phone Header: SCANZAA & Restaurant Name */}
                <div className="sticky top-0 z-20 bg-[#070D0D]/90 backdrop-blur-xl border-b border-white/10 p-5 pt-10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#00D2C4] tracking-widest uppercase block">
                        SCANZAA
                      </span>
                      <h4 className="text-base font-extrabold text-white tracking-tight">The Heritage Grill</h4>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#00D2C4]/15 text-[#00D2C4] border border-[#00D2C4]/30">
                      Table #08
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <Search className="w-3.5 h-3.5 text-[#8B9696] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Menu (e.g. Biryani, Pizza)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-[#8B9696] focus:outline-none focus:border-[#00D2C4]"
                    />
                  </div>

                  {/* Categories Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? 'bg-[#00D2C4] text-[#050808] font-bold shadow-md glow-turquoise'
                            : 'bg-white/5 text-[#8B9696] hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Items List inside Phone */}
                <div className="p-4 space-y-3.5 flex-1">
                  {filteredItems.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00D2C4]/30 transition-all flex gap-3.5 items-center"
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 filter brightness-95"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h5 className="text-xs font-bold text-white truncate">{dish.name}</h5>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            dish.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {dish.available ? 'Available' : 'Sold Out'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8B9696] line-clamp-2 leading-tight mb-2">
                          {dish.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#00D2C4]">{dish.price}</span>
                          <span className="text-[10px] text-white/40">{dish.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Bar: Instant Service Callout */}
                <div className="sticky bottom-0 bg-[#0A1111]/95 border-t border-white/10 p-3 px-5 flex items-center justify-between text-xs backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-white/80">
                    <Sparkles className="w-3.5 h-3.5 text-[#00D2C4]" />
                    <span className="text-[11px] font-medium">ScanzAA Live Menu</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#00D2C4]">Real-time Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
