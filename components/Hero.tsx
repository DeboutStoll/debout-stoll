'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

const EASE = [0.16, 1, 0.3, 1] as const;

// Hero with a Framer-Motion entrance cascade (crest → eyebrow → title → lede
// → stats), matching the original CSS choreography.
export default function Hero() {
  const t = useTranslations('hero');
  const reduce = useReducedMotion();
  const scrollLabel = useLocale() === 'en' ? 'Scroll' : 'Défiler';

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE },
        };

  const stats = [
    [t('stat1v'), t('stat1l')],
    [t('stat2v'), t('stat2l')],
    [t('stat3v'), t('stat3l')],
    [t('stat4v'), t('stat4l')],
  ];

  return (
    <header className="hero">
      <div className="hero-lines" aria-hidden="true" />
      <div className="wrap">
        <motion.div
          className="crest"
          initial={reduce ? undefined : { opacity: 0, y: 24, scale: 0.85 }}
          animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
        >
          <Image
            src="/img/crest.png"
            alt="Écusson du Collège Stoll d'Akono — Discipline, Travail, Prière, Succès"
            width={120}
            height={132}
            priority
          />
        </motion.div>

        <motion.p className="eyebrow" {...rise(0.55)}>
          {t('eyebrow')}
        </motion.p>
        <motion.h1 {...rise(0.7)}>
          {t('title')}
          <br />
          <em>{t('titleEm')}</em>
        </motion.h1>
        <motion.p className="lede" {...rise(1.15)}>
          {t('lede')}
        </motion.p>

        <motion.div className="hero-meta" {...rise(1.4)}>
          {stats.map(([value, label], i) => (
            <motion.div key={i} {...rise(1.5 + i * 0.12)}>
              <b>{value}</b>
              <small>{label}</small>
            </motion.div>
          ))}
        </motion.div>

        <div className="scroll-cue" aria-hidden="true">
          <span>{scrollLabel}</span>
          <span className="line" />
        </div>
      </div>
    </header>
  );
}
