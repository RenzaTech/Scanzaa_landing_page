import { useEffect, useRef, useState } from 'react';

const sectionIds = ['hero', 'product', 'how-it-works', 'menu-preview', 'faq', 'contact'];

export function PageIntro() {
  const [visible, setVisible] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      document.documentElement.classList.add('intro-complete');
      return undefined;
    }

    const revealTimer = window.setTimeout(() => {
      document.documentElement.classList.add('intro-complete');
      setExiting(true);
    }, 720);
    const removeTimer = window.setTimeout(() => setVisible(false), 1120);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(removeTimer);
      document.documentElement.classList.remove('intro-complete');
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`page-intro${exiting ? ' page-intro--exiting' : ''}`}
      role="status"
      aria-label="Scanzaa"
    >
      <div className="page-intro__content">
        <img src="/images/scanza-s-icon.png" alt="" className="page-intro__mark" />
        <span className="page-intro__wordmark">SCANZAA</span>
        <span className="page-intro__track"><span /></span>
      </div>
    </div>
  );
}

export default function SiteChrome() {
  const [activeSection, setActiveSection] = useState(0);
  const progressRef = useRef(null);
  const counterRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)');
    const root = document.documentElement;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    let frame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let magneticTarget = null;

    const updateChrome = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progressRef.current?.style.setProperty('--scroll-progress', String(progress));

      const marker = window.innerHeight * 0.42;
      let nextSection = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= marker) nextSection = index;
      });
      setActiveSection((current) => current === nextSection ? current : nextSection);

      if (canUseCustomCursor.matches && !reducedMotion.matches) {
        cursorRef.current?.style.setProperty('--cursor-x', `${pointerX}px`);
        cursorRef.current?.style.setProperty('--cursor-y', `${pointerY}px`);
        ringX += (pointerX - ringX) * 0.18;
        ringY += (pointerY - ringY) * 0.18;
        cursorRingRef.current?.style.setProperty('--cursor-x', `${ringX.toFixed(1)}px`);
        cursorRingRef.current?.style.setProperty('--cursor-y', `${ringY.toFixed(1)}px`);
        if (Math.abs(pointerX - ringX) > 0.5 || Math.abs(pointerY - ringY) > 0.5) scheduleUpdate();
      }

      if (magneticTarget) {
        const bounds = magneticTarget.getBoundingClientRect();
        if (!bounds.width || !bounds.height) {
          magneticTarget = null;
        } else {
          const x = ((pointerX - bounds.left) / bounds.width - 0.5) * 9;
          const y = ((pointerY - bounds.top) / bounds.height - 0.5) * 7;
          magneticTarget.style.setProperty('--magnetic-x', `${x.toFixed(1)}px`);
          magneticTarget.style.setProperty('--magnetic-y', `${y.toFixed(1)}px`);
        }
      }
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateChrome);
    };

    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      magneticTarget = target?.closest('[data-magnetic]') || null;
      const card = target?.closest('.scene-glass-card');
      if (card) {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--card-pointer-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--card-pointer-y', `${event.clientY - bounds.top}px`);
      }
      root.classList.toggle('cursor-hovering', Boolean(target?.closest('a, button, summary')));
      scheduleUpdate();
    };

    const resetMagnetic = (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-magnetic]') : null;
      const relatedTarget = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      if (target && relatedTarget && target.contains(relatedTarget)) return;
      target?.style.setProperty('--magnetic-x', '0px');
      target?.style.setProperty('--magnetic-y', '0px');
      if (!target || target === magneticTarget) magneticTarget = null;
    };

    const syncCursor = () => {
      const enabled = canUseCustomCursor.matches && !reducedMotion.matches;
      root.classList.toggle('has-custom-cursor', enabled);
      if (!enabled) root.classList.remove('cursor-hovering');
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerout', resetMagnetic);
    canUseCustomCursor.addEventListener('change', syncCursor);
    reducedMotion.addEventListener('change', syncCursor);
    syncCursor();
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', resetMagnetic);
      canUseCustomCursor.removeEventListener('change', syncCursor);
      reducedMotion.removeEventListener('change', syncCursor);
      root.classList.remove('has-custom-cursor', 'cursor-hovering');
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <div ref={counterRef} className="section-counter" aria-hidden="true">
        <span>{String(activeSection + 1).padStart(2, '0')}</span>
        <span className="section-counter__divider" />
        <span>{String(sectionIds.length).padStart(2, '0')}</span>
      </div>
      <span ref={cursorRef} className="custom-cursor custom-cursor--dot" aria-hidden="true" />
      <span ref={cursorRingRef} className="custom-cursor custom-cursor--ring" aria-hidden="true" />
    </>
  );
}
