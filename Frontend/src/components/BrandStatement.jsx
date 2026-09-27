import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrandStatement() {
  const sectionRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate line
      gsap.fromTo(lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Animate big heading words
      const words = text1Ref.current.querySelectorAll('.word');
      gsap.fromTo(words,
        { opacity: 0.15, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            end: 'center center',
            scrub: 0.5,
          }
        }
      );

      // Animate secondary paragraph
      gsap.fromTo(text2Ref.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: text2Ref.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headingText = "Restaurants are evolving. Your menu should too.";
  const wordsArray = headingText.split(" ");

  return (
    <section
      id="brand"
      ref={sectionRef}
      className="relative min-h-[85vh] w-full flex flex-col justify-center items-center bg-[#050808] py-24 px-6 overflow-hidden border-b border-white/[0.05]"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#00D2C4]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Subtle turquoise horizontal line */}
        <div 
          ref={lineRef}
          className="w-32 h-1 bg-gradient-to-r from-transparent via-[#00D2C4] to-transparent mb-12 rounded-full glow-turquoise origin-center"
        />

        {/* Large Typography Statement */}
        <h2
          ref={text1Ref}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.2] mb-8 max-w-4xl"
        >
          {wordsArray.map((word, idx) => (
            <span
              key={idx}
              className={`word inline-block mr-[0.3em] ${
                word.toLowerCase().includes('evolving') || word.toLowerCase().includes('too.')
                  ? 'text-[#00D2C4] text-glow'
                  : ''
              }`}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Smaller Subheading */}
        <p
          ref={text2Ref}
          className="text-base sm:text-xl md:text-2xl text-[#8B9696] font-normal max-w-2xl leading-relaxed"
        >
          Scanza replaces static paper menus with a smarter, connected digital menu experience designed for modern hospitality.
        </p>
      </div>
    </section>
  );
}
