import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n-config';
import { figures } from '@/content/figures';
import { t as tr } from '@/content/types';
import { Html } from './Html';
import { RichText } from './RichText';
import LightboxImage from './LightboxImage';

// Section III — Figures: the pantheon. Driven entirely by content/figures.ts.
export default function Pantheon() {
  const locale = useLocale() as Locale;
  const t = useTranslations('figures');

  return (
    <section id="figures">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <RichText as="p" className="sec-intro" path="figures.intro" />

        <div className="people">
          {figures.map((f) => (
            <div className="card" key={f.id}>
              <div className={`portrait${f.image ? '' : ' empty'}`}>
                <span className={`badge ${f.badgeKind}`}>{tr(f.badge, locale)}</span>
                {f.image && (
                  <LightboxImage
                    src={f.image}
                    alt={tr(f.imageAlt, locale)}
                    width={300}
                    height={300}
                    sizes="(max-width: 520px) 100vw, 224px"
                    caption={`<b>${f.name}</b> — ${tr(f.role, locale)} · ${tr(f.dates, locale)}`}
                  />
                )}
              </div>
              <div className="card-body">
                <span className="role">{tr(f.role, locale)}</span>
                <h4>{f.name}</h4>
                <span className="dates">{tr(f.dates, locale)}</span>
                <Html as="p" html={tr(f.bio, locale)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
