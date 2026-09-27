import React, { useEffect, useRef } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onOpenContact }) {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const headingLine1Ref = useRef(null);
  const headingLine2Ref = useRef(null);
  const supportTextRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Video Load GSAP Reveal Animation
      if (videoRef.current) {
        gsap.fromTo(
          videoRef.current,
          { scale: 1.05, opacity: 0.75 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
        );

        // 2. Scroll Parallax Video Animation via ScrollTrigger
        gsap.to(videoRef.current, {
          scale: 1.08,
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      // 3. Hero Content Reveal Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Heading Line 1 ("YOUR MENU.")
      tl.fromTo(headingLine1Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.2
      );

      // Heading Line 2 ("ONE SCAN AWAY.")
      tl.fromTo(headingLine2Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.35
      );

      // Supporting & Secondary text
      tl.fromTo([supportTextRef.current, descriptionRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        0.6
      );

      // Buttons
      tl.fromTo(buttonsRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        0.85
      );

      // Scroll Indicator
      tl.fromTo(scrollIndicatorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.1
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="hero" 
      ref={heroRef} 
      className="relative w-full h-screen min-h-[700px] flex flex-col justify-between items-center overflow-hidden bg-[#050808] pt-28 pb-8 px-6"
    >
      {/* 1. REAL FULL-SCREEN BACKGROUND VIDEO (100% Edge-to-Edge) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none filter brightness-90 contrast-105"
      >
        <source src="/videos/scanza-restaurant.mp4" type="video/mp4" />
        <source src="https://assets.mixkit.co/videos/preview/mixkit-chef-plating-a-gourmet-dish-43301-large.mp4" type="video/mp4" />
        <source src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-chef-preparing-a-dish-43302-large.mp4" type="video/mp4" />
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600" 
          alt="Scanza Restaurant Fallback" 
          className="w-full h-full object-cover"
        />
      </video>

      {/* OVERLAY LAYERS ABOVE VIDEO */}
      {/* 1. Dark Overlay across video (rgba 0,0,0,0.48) */}
      <div className="absolute inset-0 bg-black/50 z-1 pointer-events-none" />

      {/* 2. Top-to-Bottom Gradient Overlay (Top: 0.65, Middle: 0.25, Bottom: 0.85) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/85 z-2 pointer-events-none" />

      {/* 3. Radial Focal Vignette (Darker behind center text, clearer on edges) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,8,8,0.4)_0%,rgba(5,8,8,0.75)_100%)] z-3 pointer-events-none" />

      {/* 4. Turquoise Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-[#00D2C4]/15 rounded-full blur-[160px] z-4 pointer-events-none animate-pulse-glow" />

      {/* Hero Content (Vertically & Horizontally Centered) */}
      <div 
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto text-center my-auto flex flex-col items-center pt-8"
      >
        {/* Main Heading (White / #00D2C4 Typography) */}
        <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[88px] font-extrabold tracking-tight text-white leading-[1.04] mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          <span ref={headingLine1Ref} className="block text-white">
            YOUR MENU.
          </span>
          <span ref={headingLine2Ref} className="block text-[#00D2C4] gradient-text-turquoise">
            ONE SCAN AWAY.
          </span>
        </h1>

        {/* Supporting Text */}
        <p 
          ref={supportTextRef}
          className="text-lg sm:text-2xl md:text-3xl font-semibold text-white/95 max-w-3xl leading-snug mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
        >
          "Give your customers a faster, smarter way to explore your menu."
        </p>

        {/* Secondary Description */}
        <p 
          ref={descriptionRef}
          className="text-sm sm:text-base md:text-lg text-[#8B9696] max-w-2xl font-normal leading-relaxed mb-8 drop-shadow"
        >
          ScanzAA helps restaurants manage digital menus, generate QR codes and give customers instant access from their phones.
        </p>

        {/* CTA Buttons */}
        <div 
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 w-full sm:w-auto"
        >
          <button
            onClick={onOpenContact}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#00D2C4] text-[#050808] font-bold text-sm tracking-wide hover:bg-[#80FFF5] transition-all duration-300 shadow-[0_0_35px_rgba(0,210,196,0.4)] flex items-center justify-center gap-2 group glow-turquoise"
          >
            <span>Contact ScanzAA</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#ecosystem"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/20 text-white font-medium text-sm hover:bg-white/10 hover:border-[#00D2C4]/40 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
          >
            <span>Explore ScanzAA</span>
          </a>
        </div>
      </div>

      {/* Scroll to Explore Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="relative z-10 flex flex-col items-center gap-1.5 pb-2 opacity-85 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => {
          document.getElementById('brand')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[11px] font-semibold tracking-widest text-[#8B9696] uppercase">
          SCROLL TO EXPLORE
        </span>
        <ChevronDown className="w-5 h-5 text-[#00D2C4] animate-bounce" />
      </div>
    </section>
  );
}
