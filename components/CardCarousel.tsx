'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

export type CardSlide = { id: string; node: ReactNode };

// Same cinematic carousel mechanism as the image carousel, for content cards
// (inventory items, anecdotes). Directional slide + fade, drag/swipe, autoplay,
// arrows, counter, progress, dots.
export default function CardCarousel({
  slides,
  ariaLabel,
  variant = '',
  autoplayMs = 6500,
}: {
  slides: CardSlide[];
  ariaLabel: string;
  variant?: string;
  autoplayMs?: number;
}) {
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const len = slides.length;

  const paginate = useCallback(
    (delta: number) => setState(([i]) => [(i + delta + len) % len, delta]),
    [len],
  );
  const goTo = useCallback(
    (target: number) => setState(([i]) => [target, target > i ? 1 : -1]),
    [],
  );

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => paginate(1), autoplayMs);
    return () => window.clearInterval(id);
  }, [paused, reduce, paginate, autoplayMs]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '45%' : '-45%', opacity: 0, filter: 'blur(10px)' }),
    center: { x: '0%', opacity: 1, filter: 'blur(0px)' },
    exit: (d: number) => ({ x: d > 0 ? '-35%' : '35%', opacity: 0, filter: 'blur(10px)' }),
  };

  return (
    <div
      className={`cardcar ${variant}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="cardcar-stage">
        <AnimatePresence custom={dir} initial={false} mode="popLayout">
          <motion.div
            key={index}
            className="cardcar-slide"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) paginate(1);
              else if (info.offset.x > 70) paginate(-1);
            }}
          >
            {slides[index].node}
          </motion.div>
        </AnimatePresence>

        <button className="carousel-arrow prev" onClick={() => paginate(-1)} aria-label="Précédent / Previous">‹</button>
        <button className="carousel-arrow next" onClick={() => paginate(1)} aria-label="Suivant / Next">›</button>
        <div className="carousel-counter" aria-live="polite">
          <b>{String(index + 1).padStart(2, '0')}</b>
          <span>/ {String(len).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="carousel-progress" aria-hidden="true">
        <motion.span
          key={`${index}-${paused}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: paused || reduce ? 0 : 1 }}
          transition={{ duration: paused || reduce ? 0 : autoplayMs / 1000, ease: 'linear' }}
        />
      </div>

      <div className="cardcar-dots" role="tablist" aria-label={ariaLabel}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`cardcar-dot${i === index ? ' active' : ''}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
