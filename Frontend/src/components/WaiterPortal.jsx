import React, { useState, useEffect, useRef } from 'react';
import { 
  ConciergeBell, CheckCircle2, Clock, AlertTriangle, 
  User, Check, Sparkles, BellRing, PhoneCall, Receipt, Droplets, ChevronRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WaiterPortal() {
  const sectionRef = useRef(null);
  const portalRef = useRef(null);

  // Table requests state with interactive Accept/Complete actions
  const [requests, setRequests] = useState([
    {
      id: 'req-1',
      table: 'Table 12',
      type: 'Need Assistance',
      status: 'Pending',
      time: '2 mins ago',
      icon: PhoneCall
    },
    {
      id: 'req-2',
      table: 'Table 08',
      type: 'Call Waiter',
      status: 'In Progress',
      time: 'Just now',
      icon: BellRing
    },
    {
      id: 'req-3',
      table: 'Table 21',
      type: 'Request Bill',
      status: 'Pending',
      time: '4 mins ago',
      icon: Receipt
    },
    {
      id: 'req-4',
      table: 'Table 05',
      type: 'Need Water',
      status: 'Completed',
      time: '12 mins ago',
      icon: Droplets
    }
  ]);

  const handleAccept = (id) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'In Progress' } : req
    ));
  };

  const handleComplete = (id) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Completed' } : req
    ));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(portalRef.current,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
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

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <section
      id="waiter"
      ref={sectionRef}
      className="relative w-full bg-[#050808] py-28 px-6 border-b border-white/[0.05]"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#00D2C4]/8 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Waiter <span className="gradient-text-turquoise">Portal.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8B9696] leading-relaxed">
            Give your restaurant staff a simple workspace to respond to table requests and manage service activity.
          </p>
        </div>

        {/* Waiter Portal Dashboard Card Mockup */}
        <div 
          ref={portalRef}
          className="max-w-4xl mx-auto glass-panel rounded-3xl border border-[#00D2C4]/30 shadow-[0_30px_90px_-20px_rgba(0,210,196,0.2)] overflow-hidden"
        >
          {/* Dashboard Header Bar */}
          <div className="bg-[#0A1111] px-6 sm:px-8 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00D2C4]/10 border border-[#00D2C4]/30 flex items-center justify-center text-[#00D2C4] shadow-md">
                <ConciergeBell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#00D2C4] uppercase tracking-wider block">
                  WAITER DASHBOARD
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Good Evening, Arjun <span className="text-xs text-white/50 font-normal">| Section A</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#00D2C4] bg-[#00D2C4]/10 border border-[#00D2C4]/30 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2C4] animate-pulse" />
                Live Floor Active
              </span>
            </div>
          </div>

          {/* Metric Stats Banner */}
          <div className="p-6 sm:p-8 bg-[#050808]/70 border-b border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-white/10 bg-[#070D0D]">
                <span className="text-xs font-medium text-[#8B9696] block mb-1">Active Tables</span>
                <div className="text-3xl font-extrabold text-white">08</div>
                <span className="text-[11px] text-white/50 mt-1 block">Tables #01 – #14</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
                <span className="text-xs font-medium text-amber-300 block mb-1">Pending Requests</span>
                <div className="text-3xl font-extrabold text-amber-400">03</div>
                <span className="text-[11px] text-amber-300/70 mt-1 block">Needs floor response</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5">
                <span className="text-xs font-medium text-emerald-300 block mb-1">Completed Today</span>
                <div className="text-3xl font-extrabold text-emerald-400">27</div>
                <span className="text-[11px] text-emerald-300/70 mt-1 block">Avg response: 1.8 mins</span>
              </div>
            </div>
          </div>

          {/* TABLE REQUESTS SECTION */}
          <div className="p-6 sm:p-8 bg-[#050808]/80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-base font-bold text-white tracking-wide">TABLE REQUESTS</h4>
                <p className="text-xs text-[#8B9696]">Real-time customer calls and table notifications</p>
              </div>
              <span className="text-xs text-white/60 font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {requests.length} Total Calls
              </span>
            </div>

            {/* List of Table Requests */}
            <div className="space-y-3">
              {requests.map((req) => {
                const IconComp = req.icon;
                const isPending = req.status === 'Pending';
                const isInProgress = req.status === 'In Progress';
                const isCompleted = req.status === 'Completed';

                return (
                  <div 
                    key={req.id}
                    className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-[#00D2C4]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isPending 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                          : isInProgress 
                          ? 'bg-[#00D2C4]/10 text-[#00D2C4] border border-[#00D2C4]/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{req.table}</span>
                          <span className="text-[11px] text-[#8B9696]">• {req.time}</span>
                        </div>
                        <p className="text-xs text-white/80 font-medium">{req.type}</p>
                      </div>
                    </div>

                    {/* Status Pill and Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {isPending && (
                        <>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                            Pending
                          </span>
                          <button
                            onClick={() => handleAccept(req.id)}
                            className="px-4 py-1.5 rounded-xl bg-[#00D2C4] text-[#050808] font-bold text-xs hover:bg-[#80FFF5] transition-all glow-turquoise"
                          >
                            Accept
                          </button>
                        </>
                      )}

                      {isInProgress && (
                        <>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#00D2C4]/20 text-[#00D2C4] border border-[#00D2C4]/40 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2C4] animate-pulse" />
                            In Progress
                          </span>
                          <button
                            onClick={() => handleComplete(req.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-all border border-white/10"
                          >
                            Mark Done
                          </button>
                        </>
                      )}

                      {isCompleted && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
