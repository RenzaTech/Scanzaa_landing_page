import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedBackground() {
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Continuous floating ambient lighting blobs
      gsap.to(blob1Ref.current, {
        x: '+=100',
        y: '+=150',
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to(blob2Ref.current, {
        x: '-=120',
        y: '-=180',
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Ambient Blob 1 */}
      <div
        ref={blob1Ref}
        className="absolute top-1/4 left-1/12 w-[600px] h-[600px] bg-[#00D2C4]/5 rounded-full blur-[200px]"
      />

      {/* Ambient Blob 2 */}
      <div
        ref={blob2Ref}
        className="absolute bottom-1/3 right-1/12 w-[700px] h-[700px] bg-[#00D2C4]/4 rounded-full blur-[220px]"
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
    </div>
  );
}
