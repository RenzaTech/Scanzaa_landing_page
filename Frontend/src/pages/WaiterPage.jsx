import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ConciergeBell } from 'lucide-react';
import ScanzaLogo from '../components/ScanzaLogo';
import WaiterPortal from '../components/WaiterPortal';
import ContactModal from '../components/ContactModal';

export default function WaiterPage() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <div className="bg-[#050808] min-h-screen text-white font-poppins antialiased selection:bg-[#00D2C4] selection:text-[#050808]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#050808]/90 backdrop-blur-xl border-b border-[#00D2C4]/20 py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8B9696] hover:text-[#00D2C4] transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#00D2C4]/40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <div className="hidden sm:block h-4 w-[1px] bg-white/10" />
            <Link to="/">
              <ScanzaLogo size="small" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#00D2C4] bg-[#00D2C4]/10 border border-[#00D2C4]/20 px-3 py-1 rounded-full">
              <ConciergeBell className="w-3.5 h-3.5" />
              Waiter Portal Dedicated Workspace
            </span>
            <button
              onClick={() => setContactModalOpen(true)}
              className="px-4 sm:px-5 py-2 rounded-full bg-[#00D2C4] text-[#050808] font-bold text-xs hover:bg-[#80FFF5] transition-all glow-turquoise flex items-center gap-1.5"
            >
              <span>Deploy for Staff</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <WaiterPortal />
      </main>

      {/* Contact Inquiry Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}
