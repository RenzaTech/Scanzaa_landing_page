import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScanzaLogo from './ScanzaLogo';

export default function SplashScreen({ onFinish }) {
  const containerRef = useRef(null);
  const bgImgRef = useRef(null);
  const glowRef = useRef(null);
  const logoBoxRef = useRef(null);
  const poweredRef = useRef(null);
  const timelineRef = useRef(null);

  const finishSplash = () => {
    document.body.style.overflow = '';
    if (onFinish) onFinish();
  };

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: finishSplash
    });
  };

  useEffect(() => {
    // 1. Lock scrolling during splash intro
    document.body.style.overflow = 'hidden';

    // 2. Accessibility & Session Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenIntro = sessionStorage.getItem('scanza_intro_seen');

    const ctx = gsap.context(() => {
      // Fast bypass for reduced motion or repeated session visits
      if (prefersReducedMotion || hasSeenIntro) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: finishSplash
        });
        return;
      }

      // Mark session intro as seen
      sessionStorage.setItem('scanza_intro_seen', 'true');

      // Initial States
      gsap.set(logoBoxRef.current, { opacity: 0, scale: 0.88, y: 20 });
      if (poweredRef.current) {
        gsap.set(poweredRef.current, { opacity: 0, y: 15 });
      }
      gsap.set(glowRef.current, { opacity: 0, scale: 0.8 });
      if (bgImgRef.current) {
        gsap.set(bgImgRef.current, { opacity: 0.08, scale: 1 });
      }

      // Master Intro Timeline (Total duration ~2.4s: sleek, punchy, fluid on mobile)
      const tl = gsap.timeline({
        onComplete: finishSplash
      });
      timelineRef.current = tl;

      // 0.15s: Logo appears with smooth ease
      tl.to(logoBoxRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out'
      }, 0.15);

      // 0.35s: "Powered by Renza" enters
      if (poweredRef.current) {
        tl.to(poweredRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out'
        }, 0.35);
      }

      // 0.30s: Turquoise Brand Glow Blooms
      tl.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.25,
        duration: 0.8,
        ease: 'sine.out'
      }, 0.3);

      // 1.10s: Ambient Pulse
      tl.to(glowRef.current, {
        opacity: 0.35,
        scale: 1.4,
        duration: 0.7,
        ease: 'sine.inOut'
      }, 1.1);

      // 1.80s - 2.45s: Silky Cinematic Dissolve to Main Page
      // Forward drift + opacity fade (zero clipping, zero mobile stutter)
      tl.to([logoBoxRef.current, glowRef.current], {
        opacity: 0,
        scale: 1.05,
        y: -12,
        duration: 0.65,
        ease: 'power2.inOut'
      }, 1.8);

      // Background cross-fades out to reveal the main page
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.65,
        ease: 'power2.inOut'
      }, 1.8);

    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#050808] flex items-center justify-center overflow-hidden select-none transform-gpu will-change-[opacity]"
      style={{ height: '100dvh' }}
    >
      {/* Skip button */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-6 right-6 z-30 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium tracking-widest text-[#8B9696] hover:text-[#00D2C4] hover:border-[#00D2C4]/40 transition-all uppercase"
      >
        Skip
      </button>

      {/* 1. Background Image / Pattern Texture */}
      <div
        ref={bgImgRef}
        className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none transform-gpu"
      />

      {/* 2. Dark Overlay */}
      <div className="absolute inset-0 bg-black/80 pointer-events-none z-[1]" />

      {/* 3. Subtle Turquoise Atmospheric Glow */}
      <div
        ref={glowRef}
        className="absolute w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] bg-[#00D2C4]/20 rounded-full blur-[70px] sm:blur-[90px] pointer-events-none z-[2] transform-gpu will-change-[transform,opacity]"
      />

      {/* 4. SCANZAA Logo & Powered By Brand Box */}
      <div
        ref={logoBoxRef}
        className="relative z-10 flex flex-col items-center px-4 max-w-full text-center transform-gpu will-change-[transform,opacity]"
      >
        <ScanzaLogo
          size="splash"
          layout="vertical"
          showTagline={true}
          taglineText="SCAN  DISCOVER  DINE"
          className="filter drop-shadow-[0_0_35px_rgba(0,210,196,0.45)] max-w-[260px] sm:max-w-none"
        />
        <div
          ref={poweredRef}
          className="mt-6 flex items-center gap-1.5 text-xs sm:text-sm font-medium tracking-[0.25em] text-[#8B9696] uppercase"
        >
          <span>Powered by</span>
          <span className="font-bold text-[#00D2C4] tracking-[0.3em] drop-shadow-[0_0_12px_rgba(0,210,196,0.4)]">
            Renza
          </span>
        </div>
      </div>
    </div>
  );
}
