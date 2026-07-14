'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { social } from '@/content/social';

const EASE = [0.16, 1, 0.3, 1] as const;

// Film-style intro (ARTE / Netflix documentary): eyebrow → title → lede →
// "Rejoindre l'appel" call to action → stats. No crest here by design.
export default function Hero() {
  const t = useTranslations('hero');
  const nav = useTranslations('nav');
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

        <motion.div className="hero-cta" {...rise(1.1)}>
          <a
            className="jbtn jbtn-fb"
            href={social.facebookGroup}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="fb-glyph" aria-hidden="true">
              f
            </span>
            {nav('rejoindre')}
          </a>
        </motion.div>

        <motion.div className="hero-meta" {...rise(1.3)}>
          {stats.map(([value, label], i) => (
            <motion.div key={i} {...rise(1.4 + i * 0.12)}>
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
