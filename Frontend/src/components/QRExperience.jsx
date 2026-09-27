import React, { useState, useEffect, useRef } from 'react';
import { DEMO_MENU_ITEMS } from '../data/scanzaData';
import { QrCode, Search, Smartphone, Sparkles, Check, ChevronRight, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function QRExperience() {
  const sectionRef = useRef(null);
  const leftQrRef = useRef(null);
  const rightPhoneRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Chef Specials', 'Main Course', 'Starters', 'Artisanal Drinks', 'Desserts'];

  const filteredItems = DEMO_MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftQrRef.current,
        { opacity: 0, x: -60, y: 30 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );

      gsap.fromTo(rightPhoneRef.current,
        { opacity: 0, x: 60, y: 30 },
        {
          opacity: 1,
          x: 0,
          y: 0,
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
      id="qr-experience"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05] overflow-hidden"
    >
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#00D2C4]/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D2C4]/10 border border-[#00D2C4]/30 text-[#00D2C4] text-xs font-semibold uppercase tracking-wider mb-4">
            <QrCode className="w-3.5 h-3.5" />
            <span>Interactive QR Demo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            One Scan. <br />
            <span className="gradient-text-turquoise">A Complete Menu Experience.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Test the live guest experience right here. Scan the acrylic stand QR or interact with the mobile menu mockup on the right.
          </p>
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Premium Acrylic QR Stand Visual */}
          <div ref={leftQrRef} className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm glass-panel rounded-3xl p-8 border border-[#00D2C4]/30 shadow-2xl flex flex-col items-center text-center group">
              {/* Stand Header */}
              <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="text-xs font-semibold text-[#8B9696] tracking-wider uppercase">Table #14</span>
                <span className="text-xs font-bold text-[#00D2C4] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D2C4] animate-ping" /> SCANZA ACTIVE
                </span>
              </div>

              {/* QR Stand Acrylic Mockup Frame */}
              <div className="relative p-6 bg-gradient-to-b from-[#0A1111] to-[#050808] rounded-2xl border border-[#00D2C4]/40 shadow-inner group-hover:border-[#00D2C4] transition-colors mb-6">
                {/* QR Code SVG / Vector Graphic */}
                <div className="relative w-48 h-48 bg-white p-3 rounded-xl shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between relative bg-white">
                    {/* Corner Position Detection Squares */}
                    <div className="absolute top-2 left-2 w-10 h-10 border-4 border-black bg-black p-1">
                      <div className="w-full h-full bg-white p-1">
                        <div className="w-full h-full bg-black" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 w-10 h-10 border-4 border-black bg-black p-1">
                      <div className="w-full h-full bg-white p-1">
                        <div className="w-full h-full bg-black" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 w-10 h-10 border-4 border-black bg-black p-1">
                      <div className="w-full h-full bg-white p-1">
                        <div className="w-full h-full bg-black" />
                      </div>
                    </div>

                    {/* Center Scanza Brand Badge */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 bg-[#050808] rounded-lg border-2 border-[#00D2C4] flex items-center justify-center shadow-lg">
                        <QrCode className="w-6 h-6 text-[#00D2C4]" />
                      </div>
                    </div>

                    {/* QR Matrix Decorative Dots */}
                    <div className="w-full h-full grid grid-cols-6 gap-1 opacity-70">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            i % 2 === 0 ? 'bg-black' : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stand Instructions */}
              <h4 className="text-lg font-bold text-white mb-1">SCAN FOR DIGITAL MENU</h4>
              <p className="text-xs text-[#8B9696] mb-4">No application download required</p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D2C4]/10 text-[#00D2C4] text-xs font-semibold">
                <Smartphone className="w-3.5 h-3.5" /> Point Camera to Open
              </div>
            </div>
          </div>

          {/* Right Column: Mobile Phone Mockup Showing Live Scanza Menu */}
          <div ref={rightPhoneRef} className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-md bg-[#050808] rounded-[42px] border-[8px] border-[#1A2626] p-4 shadow-[0_25px_60px_-15px_rgba(0,210,196,0.25)] overflow-hidden">
              
              {/* Phone Notch */}
              <div className="w-32 h-5 bg-[#1A2626] rounded-b-2xl mx-auto mb-3 flex items-center justify-center">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Phone Content Screen */}
              <div className="bg-[#0A1111] rounded-[28px] p-4 min-h-[560px] flex flex-col border border-white/10">
                {/* Phone Menu Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#00D2C4] uppercase tracking-widest block">Scanza Digital Menu</span>
                    <h3 className="text-base font-bold text-white">Artisan Bistro</h3>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live Menu
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 text-[#8B9696] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search dishes, drinks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#8B9696] focus:outline-none focus:border-[#00D2C4]"
                  />
                </div>

                {/* Horizontal Category Selector */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#00D2C4] text-[#050808] glow-turquoise'
                          : 'bg-white/5 text-[#8B9696] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Menu Items List inside Phone */}
                <div className="flex-1 overflow-y-auto space-y-3 max-h-[360px] pr-1">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#8B9696]">
                      No menu items found.
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 flex items-center gap-3 hover:border-[#00D2C4]/40 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                            <span className="text-xs font-extrabold text-[#00D2C4] shrink-0">{item.price}</span>
                          </div>
                          <p className="text-[10px] text-[#8B9696] line-clamp-1 mb-1">{item.description}</p>
                          <div className="flex items-center gap-1.5">
                            {item.available ? (
                              <span className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                                Available
                              </span>
                            ) : (
                              <span className="text-[9px] font-semibold bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded">
                                Sold Out
                              </span>
                            )}
                            <span className="text-[9px] text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
                              {item.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer bar on phone */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#8B9696]">
                  <span>Powered by Scanza Digital Menu</span>
                  <span className="text-[#00D2C4]">Table #14</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
