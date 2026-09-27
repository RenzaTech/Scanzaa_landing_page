import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Utensils, Sliders, QrCode, Grid3X3, TrendingUp, 
  Settings, Bell, Plus, Check, AlertCircle, Sparkles
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RestaurantDashboard() {
  const sectionRef = useRef(null);
  const dashboardRef = useRef(null);

  // Live interactive state for menu items
  const [items, setItems] = useState([
    { id: 1, name: 'Chicken Biryani', category: 'Main Course', price: '₹220', available: true },
    { id: 2, name: 'Paneer Tikka', category: 'Starters', price: '₹180', available: true },
    { id: 3, name: 'Mutton Biryani', category: 'Main Course', price: '₹280', available: false },
    { id: 4, name: 'Truffle Risotto', category: 'Chef Specials', price: '₹580', available: true },
    { id: 5, name: 'Wood-Fired Pizza', category: 'Chef Specials', price: '₹490', available: true }
  ]);

  const [activeTab, setActiveTab] = useState('Menu');

  const toggleItemAvailability = (id) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(dashboardRef.current,
        { opacity: 0, y: 60, rotateX: 6 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
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

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Menu', icon: Utensils },
    { name: 'Categories', icon: Sliders },
    { name: 'QR Management', icon: QrCode },
    { name: 'Tables', icon: Grid3X3 },
    { name: 'Analytics', icon: TrendingUp },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <section
      id="admin"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05]"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[450px] bg-[#00D2C4]/5 rounded-full blur-[220px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Restaurant <span className="gradient-text-turquoise">Admin.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Manage your restaurant's digital menu, QR codes and restaurant information from one centralized dashboard.
          </p>
        </div>

        {/* Dashboard 3D Perspectives Frame */}
        <div 
          ref={dashboardRef}
          style={{ perspective: '1200px' }}
          className="relative glass-panel rounded-3xl border border-[#00D2C4]/30 shadow-[0_30px_90px_-20px_rgba(0,210,196,0.25)] overflow-hidden transition-all duration-700"
        >
          {/* Top Bar of Dashboard */}
          <div className="bg-[#0A1111] px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-bold text-[#00D2C4] tracking-wider uppercase ml-2 border-l border-white/10 pl-4 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#00D2C4]/20 text-[10px] text-[#00D2C4] font-extrabold">RESTAURANT ADMIN</span>
                <span className="text-white/60 hidden sm:inline">| The Heritage Grill</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync Enabled
              </span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                <Bell className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 bg-[#070D0D] p-5 border-b lg:border-b-0 lg:border-r border-white/10 space-y-1.5">
              <div className="text-[10px] font-bold text-[#8B9696] uppercase tracking-wider mb-3 px-3">
                Workspace Menu
              </div>
              {sidebarLinks.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#00D2C4] text-[#050808] glow-turquoise font-bold shadow-lg'
                        : 'text-[#8B9696] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Dashboard Content Body */}
            <div className="lg:col-span-9 p-6 sm:p-8 space-y-8 bg-[#050808]/70">
              
              {/* Restaurant Overview Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Restaurant Overview</h3>
                  <p className="text-xs text-[#8B9696]">Live inventory and category health across active tables</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-[#00D2C4] text-[#050808] font-bold text-xs flex items-center gap-1.5 glow-turquoise hover:bg-[#80FFF5] transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add New Item
                </button>
              </div>

              {/* Metric Cards Grid: Exactly as requested */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-card rounded-2xl p-4 border border-white/10">
                  <span className="text-xs font-medium text-[#8B9696] block mb-1">Menu Items</span>
                  <div className="text-3xl font-extrabold text-white">86</div>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-xs font-medium text-emerald-300 block mb-1">Available</span>
                  <div className="text-3xl font-extrabold text-emerald-400">79</div>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-red-500/20 bg-red-500/5">
                  <span className="text-xs font-medium text-red-300 block mb-1">Unavailable</span>
                  <div className="text-3xl font-extrabold text-red-400">7</div>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-[#00D2C4]/20 bg-[#00D2C4]/5">
                  <span className="text-xs font-medium text-[#00D2C4] block mb-1">Categories</span>
                  <div className="text-3xl font-extrabold text-white">12</div>
                </div>
              </div>

              {/* Table of Live Menu Items */}
              <div className="bg-[#0A1111] rounded-2xl border border-white/10 p-5 overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-white tracking-wide">Featured Dishes</h4>
                  <span className="text-[11px] text-[#8B9696]">Click badge to toggle availability in real-time</span>
                </div>

                <table className="w-full text-left text-xs text-white">
                  <thead>
                    <tr className="border-b border-white/10 text-[#8B9696] uppercase text-[10px] tracking-wider">
                      <th className="pb-3 font-semibold">Dish Name</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 font-medium text-white flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-[#00D2C4]' : 'bg-red-400'}`} />
                          {item.name}
                        </td>
                        <td className="py-3 text-[#8B9696]">{item.category}</td>
                        <td className="py-3 font-semibold text-[#00D2C4]">{item.price}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 ${
                              item.available
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {item.available ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
