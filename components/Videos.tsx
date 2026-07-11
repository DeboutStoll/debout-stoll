'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { videos } from '@/content/videos';
import { t as tr } from '@/content/types';
import { Html } from './Html';
import { RichText } from './RichText';

// Section V — Films. Lightweight facades (poster + play) that only load the
// YouTube iframe on click — better performance & friendlier to data-light.
// English visitors get YouTube's auto-translated captions + a narration guide.
export default function Videos() {
  const locale = useLocale() as Locale;
  const t = useTranslations('films');

  return (
    <section id="films">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <RichText as="p" className="sec-intro" path="films.intro" />

        <div className="videos">
          {videos.map((v) => (
            <figure className="vid" key={v.id}>
              <YouTubeFacade
                youtubeId={v.youtubeId}
                start={v.start}
                title={tr(v.title, locale)}
                locale={locale}
              />
              <Html as="figcaption" html={tr(v.caption, locale)} />
              {locale === 'en' && v.transcriptEn && (
                <Transcript html={v.transcriptEn} />
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Transcript({ html }: { html: string }) {
  return (
    <details className="vid-transcript">
      <summary>
        <span className="vt-flag" aria-hidden="true">🇬🇧</span> English transcript
      </summary>
      <div className="vt-body" dangerouslySetInnerHTML={{ __html: html }} />
    </details>
  );
}

export function youtubeSrc(youtubeId: string, locale: string, start?: number) {
  const params = new URLSearchParams({ autoplay: '1', rel: '0', cc_load_policy: '1' });
  if (locale === 'en') {
    params.set('cc_lang_pref', 'en');
    params.set('hl', 'en');
  }
  if (start) params.set('start', String(start));
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`;
}

function YouTubeFacade({
  youtubeId,
  start,
  title,
  locale,
}: {
  youtubeId: string;
  start?: number;
  title: string;
  locale: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const src = youtubeSrc(youtubeId, locale, start);
  const poster = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className="vid-yt-frame">
      {loaded ? (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          className="vid-facade"
          style={{ backgroundImage: `url(${poster})` }}
          onClick={() => setLoaded(true)}
          aria-label={`${title} — ▶`}
        >
          <span className="play" aria-hidden="true">
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
