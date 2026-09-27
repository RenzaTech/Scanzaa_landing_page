import React from 'react';
import { FOOTER_LINKS } from '../data/scanzaData';
import { ArrowRight } from 'lucide-react';
import ScanzaLogo from './ScanzaLogo';

export default function Footer({ onOpenContact }) {
  const socialIcons = [
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com',
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'X',
      href: 'https://x.com',
      svg: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    }
  ];

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
            <p className="text-xs sm:text-sm text-[#8B9696] max-w-sm mt-3 leading-relaxed">
              The premier digital menu and table-service platform for modern restaurants.
            </p>
          </div>

          <div>
            <button
              onClick={onOpenContact}
              className="px-6 py-3.5 rounded-full bg-[#00D2C4] text-[#050808] font-bold text-xs tracking-wider uppercase hover:bg-[#80FFF5] transition-all inline-flex items-center gap-2 glow-turquoise"
            >
              <span>Contact for Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Footer Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 py-16">
          {/* Column 1: SCanzAA */}
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
            <p className="text-xs text-[#8B9696] mb-4">Follow ScanzAA updates</p>
            <div className="flex items-center gap-2.5">
              {socialIcons.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8B9696] hover:text-[#00D2C4] hover:border-[#00D2C4]/40 hover:bg-[#00D2C4]/10 transition-colors"
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B9696]">
          <div>
            © 2026 ScanzAA. All rights reserved.
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
