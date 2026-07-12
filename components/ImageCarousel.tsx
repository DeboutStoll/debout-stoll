'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 6000;

export type CarouselImage = {
  id: string;
  src: string;
  alt: string;
  caption: string; // trusted HTML
};

// Advanced cinematic image carousel (ARTE) — directional slide + blur + scale
// transitions, Ken Burns on cover images, drag/swipe, autoplay, thumbnails,
// counter, and a full-resolution lightbox. Reused across Lieux, Figures,
// L'église.
export default function ImageCarousel({
  items,
  ariaLabel,
  aspect = '16 / 9',
  fit = 'cover',
}: {
  items: CarouselImage[];
  ariaLabel: string;
  aspect?: string;
  fit?: 'cover' | 'contain';
}) {
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const len = items.length;
  const kenBurns = fit === 'cover';

  const paginate = useCallback(
    (delta: number) => setState(([i]) => [(i + delta + len) % len, delta]),
    [len],
  );
  const goTo = useCallback(
    (target: number) => setState(([i]) => [target, target > i ? 1 : -1]),
    [],
  );

  useEffect(() => {
    if (paused || lightbox || reduce) return;
    const id = window.setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, lightbox, reduce, paginate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) {
        if (e.key === 'Escape') setLightbox(false);
        return;
      }
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paginate, lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const item = items[index];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '55%' : '-55%', opacity: 0, scale: 1.08, filter: 'blur(14px)' }),
    center: { x: '0%', opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: (d: number) => ({ x: d > 0 ? '-45%' : '45%', opacity: 0, scale: 1.03, filter: 'blur(14px)' }),
  };

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="carousel-stage" style={{ aspectRatio: aspect }}>
        <div className="carousel-bars" aria-hidden="true" />
        <AnimatePresence custom={dir} initial={false} mode="popLayout">
          <motion.div
            key={index}
            className="carousel-slide"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.85, ease: EASE }}
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) paginate(1);
              else if (info.offset.x > 80) paginate(-1);
            }}
          >
            <motion.div
              className="carousel-kenburns"
              initial={{ scale: reduce || !kenBurns ? 1 : 1.02 }}
              animate={{ scale: reduce || !kenBurns ? 1 : 1.1 }}
              transition={{ duration: 8, ease: 'linear' }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 1160px) 100vw, 1100px"
                priority={index === 0}
                draggable={false}
                style={{ objectFit: fit }}
              />
            </motion.div>
            <button className="carousel-expand" onClick={() => setLightbox(true)} aria-label="Agrandir / enlarge">
              ⤢
            </button>
            <div className="carousel-caption" dangerouslySetInnerHTML={{ __html: item.caption }} />
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
          transition={{ duration: paused || reduce ? 0 : AUTOPLAY_MS / 1000, ease: 'linear' }}
        />
      </div>

      <div className="carousel-thumbs" role="tablist" aria-label={ariaLabel}>
        {items.map((g, i) => (
          <button
            key={g.id}
            className={`carousel-thumb${i === index ? ' active' : ''}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === index}
            aria-label={g.alt}
          >
            <Image src={g.src} alt="" width={110} height={72} sizes="110px" style={{ objectFit: 'cover' }} />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
            aria-label={item.alt}
          >
            <div className="lightbox-bars" aria-hidden="true" />
            <button className="lightbox-close" onClick={() => setLightbox(false)} aria-label="Fermer / Close">✕</button>
            <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="lightbox-img" />
              <figcaption dangerouslySetInnerHTML={{ __html: item.caption }} />
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
