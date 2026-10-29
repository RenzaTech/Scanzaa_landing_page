import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function Footer({ onOpenContact }) {
  const privacyUrl = import.meta.env.VITE_PRIVACY_POLICY_URL;

  return (
    <footer className="site-footer relative isolate overflow-hidden px-5 py-20 text-white sm:px-8 sm:py-28">
      <div aria-hidden="true" data-parallax-speed="0.12" className="parallax-layer site-footer__glow pointer-events-none absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.4fr_0.6fr_0.6fr] lg:gap-20">
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FCC133]">A clearer menu moment</p>
            <a href="#hero" aria-label="Scanzaa home" className="footer-wordmark font-display block text-[clamp(4rem,12vw,10rem)] leading-[0.78] tracking-[-0.055em] text-[#f3f0e8]">
              Scan<span className="text-[#FCC133]">zaa</span><span className="text-[#FCC133]">.</span>
            </a>
            <p className="mt-8 max-w-md text-sm leading-[1.7] text-white/60">
              A clearer way for restaurant teams to manage menus and guests to browse them.
            </p>
          </div>
          <nav aria-label="Platform links" className="footer-links">
            <h2>Explore</h2>
            <a href="#product">Platform</a>
            <a href="#how-it-works">How it works</a>
            <a href="#menu-preview">Guest menu</a>
          </nav>
          <div className="footer-links">
            <h2>Have a question?</h2>
            <a href="#faq">Frequently asked questions</a>
            <button type="button" onClick={onOpenContact} className="footer-contact-link">
              Talk to our team <ArrowUpRight size={15} />
            </button>
            <a data-magnetic href="#contact" className="premium-button mt-3 inline-flex min-h-12 w-fit items-center gap-3 rounded-full border border-[#FCC133] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#FCC133] transition hover:bg-[#FCC133] hover:text-[#183b34]">
              <span>Get in touch</span><ArrowRight size={15} />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-6 text-[11px] tracking-[0.04em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Scanzaa. Powered by Renza.</p>
          {privacyUrl && (
            <a href={privacyUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 transition hover:text-white">
              Privacy policy
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
