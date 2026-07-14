'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

const EASE = [0.16, 1, 0.3, 1] as const;

// Readable hero beneath the cinematic intro: eyebrow → title → lede → stats.
// No crest and no call to action here by design (the intro is pure title).
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
        <motion.p className="eyebrow" {...rise(0.35)}>
          {t('eyebrow')}
        </motion.p>
        <motion.h1 {...rise(0.5)}>
          {t('title')}
          <br />
          <em>{t('titleEm')}</em>
        </motion.h1>
        <motion.p className="lede" {...rise(0.9)}>
          {t('lede')}
        </motion.p>

        <motion.div className="hero-meta" {...rise(1.15)}>
          {stats.map(([value, label], i) => (
            <motion.div key={i} {...rise(1.25 + i * 0.12)}>
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
