'use client';

import { useEffect, useRef } from 'react';

// Reading-progress bar + hero parallax + back-to-top visibility.
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const toTopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bar = barRef.current;
    const toTop = toTopRef.current;
    const heroLines = document.querySelector<HTMLElement>('.hero-lines');
    const hero = document.querySelector<HTMLElement>('.hero');
    let ticking = false;

    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? ((h.scrollTop || document.body.scrollTop) / max) * 100 : 0;
      if (bar) bar.style.width = pct + '%';
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
      const y = window.scrollY;
      if (toTop) toTop.classList.toggle('show', y > 600);
      if (!reduce && y < 900 && heroLines) {
        heroLines.style.transform = `translateY(${y * 0.25}px)`;
        if (hero) hero.style.opacity = String(Math.max(0, 1 - y / 700));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="scroll-progress" ref={barRef} aria-hidden="true" />
      <button
        className="to-top"
        ref={toTopRef}
        onClick={scrollTop}
        aria-label="Top"
      >
        ↑
      </button>
    </>
  );
}
