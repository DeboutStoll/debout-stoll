'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { inventory, chapters } from '@/content/inventory';
import { constatVideo } from '@/content/videos';
import { t as tr } from '@/content/types';
import { Html } from './Html';
import { RichText } from './RichText';
import { Transcript } from './Videos';
import CardCarousel from './CardCarousel';

// Section VIII — Le constat: the 16-minute testimony with clickable chapters.
export default function Constat() {
  const locale = useLocale() as Locale;
  const t = useTranslations('constat');
  const [start, setStart] = useState<number | null>(null);
  const figureRef = useRef<HTMLElement>(null);

  const play = (seconds: number) => {
    setStart(seconds);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    figureRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  const params = new URLSearchParams({ rel: '0', cc_load_policy: '1' });
  if (locale === 'en') {
    params.set('cc_lang_pref', 'en');
    params.set('hl', 'en');
  }
  if (start !== null) {
    params.set('start', String(start));
    params.set('autoplay', '1');
  }
  const src = `https://www.youtube-nocookie.com/embed/${constatVideo.youtubeId}?${params}`;
  const poster = `https://i.ytimg.com/vi/${constatVideo.youtubeId}/hqdefault.jpg`;

  return (
    <section id="constat">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>

        {/* SOS — preamble of the reckoning */}
        <div className="sos sos-preamble">
          <p className="eyebrow">{t('sosEyebrow')}</p>
          <p className="big">
            <b>{t('sosBig')}</b>
          </p>
          <p>{t('sosP')}</p>
          <p style={{ marginTop: 16, color: 'var(--gold-soft)', fontStyle: 'italic' }}>
            {t('sosClose')}
          </p>
        </div>

        <h2 className="sec-title" style={{ marginTop: 40 }}>{t('title')}</h2>
        <div className="constat-intro">
          <p className="constat-hook">{t('leadHook')}</p>
          <p className="constat-body">{t('leadBody')}</p>
          <div className="constat-contrast">
            <div className="cc-then">
              <span className="cc-label">{t('thenLabel')}</span>
              <div className="cc-chips">
                {t('thenStates')
                  .split('·')
                  .map((s) => (
                    <span className="cc-chip" key={s}>
                      {s.trim()}
                    </span>
                  ))}
              </div>
            </div>
            <div className="cc-arrow" aria-hidden="true">
              →
            </div>
            <div className="cc-now">
              <span className="cc-label cc-label-now">{t('nowLabel')}</span>
              <b>{t('leadStrike')}</b>
            </div>
          </div>
        </div>

        <figure className="constat-video" ref={figureRef}>
          <div className="cv-frame">
            {start === null ? (
              <button
                className="vid-facade"
                style={{ backgroundImage: `url(${poster})` }}
                onClick={() => play(0)}
                aria-label={`${tr(constatVideo.title, locale)} — ▶`}
              >
                <span className="play" aria-hidden="true">
                  ▶
                </span>
              </button>
            ) : (
              <iframe
                src={src}
                title={tr(constatVideo.title, locale)}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            )}
          </div>
          <Html as="figcaption" className="cv-caption" html={tr(constatVideo.caption, locale)} />
        </figure>

        {locale === 'en' && constatVideo.transcriptEn && (
          <Transcript html={constatVideo.transcriptEn} />
        )}

        <div className="chapters">
          <span className="chap-label">{t('chaptersLabel')}</span>
          {chapters.map((c) => (
            <button className="chap" key={c.seconds} onClick={() => play(c.seconds)}>
              {tr(c.label, locale)}
            </button>
          ))}
        </div>

        <p className="constat-lead" style={{ marginTop: 34 }} dangerouslySetInnerHTML={{ __html: t('invLead') }} />
        <CardCarousel
          ariaLabel={locale === 'en' ? 'Patrimony at risk' : 'Patrimoine en péril'}
          variant="cardcar-inventory"
          slides={inventory.map((item, i) => ({
            id: item.id,
            node: (
              <div className="inv-card">
                <span className="inv-card-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="inv-card-ic" aria-hidden="true">
                  {item.icon}
                </span>
                <b>{tr(item.title, locale)}</b>
                <span className="inv-card-detail">{tr(item.detail, locale)}</span>
              </div>
            ),
          }))}
        />

        <div className="constat-strike">
          <RichText as="p" path="constat.strike" />
        </div>
      </div>
    </section>
  );
}
