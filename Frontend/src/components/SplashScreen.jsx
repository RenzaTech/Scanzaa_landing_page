import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScanzaLogo from './ScanzaLogo';

export default function SplashScreen({ onFinish }) {
  const containerRef = useRef(null);
  const bgImgRef = useRef(null);
  const glowRef = useRef(null);
  const logoBoxRef = useRef(null);

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
          duration: 4,
          ease: 'power2.inOut',
          onComplete: () => {
            document.body.style.overflow = '';
            if (onFinish) onFinish();
          }
        });
        return;
      }

      // Mark session intro as seen
      sessionStorage.setItem('scanza_intro_seen', 'true');

      // Initial States
      gsap.set(logoBoxRef.current, { opacity: 0, scale: 0.75, y: 25 });
      gsap.set(glowRef.current, { opacity: 0, scale: 0.7 });
      gsap.set(containerRef.current, { clipPath: 'circle(150% at 50% 50%)' });
      if (bgImgRef.current) {
        gsap.set(bgImgRef.current, { opacity: 0.10, scale: 1 });
        // Slow subtle background movement & opacity breathing (12s duration, scale 1 -> 1.02, opacity 0.08 -> 0.12)
        gsap.to(bgImgRef.current, {
          scale: 1.02,
          opacity: 0.12,
          duration: 12,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      }

      // Master Intro Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          if (onFinish) onFinish();
        }
      });

      // 0.20s: Logo image appears
      tl.to(logoBoxRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, 0.2);

      // 0.80s: Turquoise Brand Activation Glow
      tl.to(glowRef.current, {
        opacity: 0.55,
        scale: 1.3,
        duration: 0.6,
        ease: 'sine.out'
      }, 0.8);

      tl.to(glowRef.current, {
        opacity: 0,
        scale: 1.5,
        duration: 0.6,
        ease: 'sine.in'
      }, 1.4);

      // 2.00s: Brand Hold
      tl.to({}, { duration: 1.5 }, 2.0);

      // 3.50s - 4.50s: Drive Animation to Top-Left Navbar Position & Video Reveal
      tl.to(logoBoxRef.current, {
        x: -window.innerWidth * 0.38,
        y: -window.innerHeight * 0.43,
        scale: 0.28,
        opacity: 0.7,
        duration: 0.95,
        ease: 'power3.inOut'
      }, 3.5);

      tl.to(containerRef.current, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1.0,
        ease: 'power4.inOut'
      }, 3.5);

      // Final opacity cleanup
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.15
      }, 4.45);

    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#050808] flex items-center justify-center overflow-hidden pointer-events-none select-none"
    >
      {/* 1. Background Image / Pattern Texture */}
      <div
        ref={bgImgRef}
        className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none transform-gpu"
      />

      {/* 2. Dark Overlay (rgba(0, 0, 0, 0.80)) */}
      <div className="absolute inset-0 bg-black/80 pointer-events-none z-[1]" />

      {/* 3. Subtle Turquoise Atmospheric Glow */}
      <div
        ref={glowRef}
        className="absolute w-[500px] h-[500px] bg-[#00D2C4]/20 rounded-full blur-[80px] pointer-events-none z-[2]"
      />

      {/* 4. SCANZAA Logo — black bg melts into page via screen blend */}
      <div ref={logoBoxRef} className="relative z-10 flex flex-col items-center">
        <ScanzaLogo
          size="splash"
          layout="vertical"
          showTagline={true}
          taglineText="SCAN  DISCOVER  DINE"
          className="filter drop-shadow-[0_0_40px_rgba(0,210,196,0.5)]"
        />
      </div>
    </div>
  );
}
