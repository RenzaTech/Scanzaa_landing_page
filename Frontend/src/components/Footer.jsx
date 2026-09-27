import React from 'react';
import { FOOTER_LINKS } from '../data/scanzaData';
import { ArrowRight, Globe, Share2, MessageSquare, Send } from 'lucide-react';
import ScanzaLogo from './ScanzaLogo';

export default function Footer({ onOpenContact }) {
  return (
    <footer className="w-full bg-[#030505] text-white pt-20 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D2C4]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Top Header Row with Logo & Contact Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-16 border-b border-white/10 gap-8">
          <div>
            <a href="#hero" className="flex items-center gap-3 group mb-2">
              <ScanzaLogo size="default" />
            </a>
            <p className="text-xs sm:text-sm text-[#8B9696] max-w-sm mt-3">
              The premier QR-based digital menu infrastructure for modern restaurants and luxury dining spaces.
            </p>
          </div>

          <div>
            <button
              onClick={onOpenContact}
              className="px-6 py-3 rounded-full bg-[#00D2C4] text-[#050808] font-semibold text-xs tracking-wider uppercase hover:bg-[#80FFF5] transition-all inline-flex items-center gap-2 glow-turquoise"
            >
              <span>Contact for Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Footer Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 py-16">
          {/* Column 1: Scanza */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wider uppercase">
              {FOOTER_LINKS.column1.title}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B9696]">
              {FOOTER_LINKS.column1.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-[#00D2C4] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: For Restaurants */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wider uppercase">
              {FOOTER_LINKS.column2.title}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B9696]">
              {FOOTER_LINKS.column2.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-[#00D2C4] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wider uppercase">
              {FOOTER_LINKS.column3.title}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B9696]">
              {FOOTER_LINKS.column3.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-[#00D2C4] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wider uppercase">
              {FOOTER_LINKS.column4.title}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8B9696]">
              {FOOTER_LINKS.column4.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-[#00D2C4] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Connect Social Icons */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wider uppercase">
              Connect
            </h4>
            <p className="text-xs text-[#8B9696] mb-4">Follow Scanza updates</p>
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: '#', label: 'Website' },
                { icon: Share2, href: '#', label: 'Share' },
                { icon: MessageSquare, href: '#', label: 'Chat' },
                { icon: Send, href: '#', label: 'Contact' }
              ].map((social, idx) => {
                const IconComp = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    title={social.label}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8B9696] hover:text-[#00D2C4] hover:border-[#00D2C4]/40 hover:bg-[#00D2C4]/10 transition-colors"
                  >
                    <IconComp className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B9696]">
          <div>
            © 2026 Scanza. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
