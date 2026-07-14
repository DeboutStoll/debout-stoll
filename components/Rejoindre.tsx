import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { social } from '@/content/social';
import { RichText } from './RichText';
import StatsCounter from './StatsCounter';
import ShareBar from './ShareBar';

// Section IX — Rejoindre l'appel. Everything now lives in the Facebook group:
// one clear call to action to join it, then members publish freely there.
export default function Rejoindre() {
  const t = useTranslations('rejoindre');
  const cta = useTranslations('cta');
  const locale = useLocale();

  return (
    <section id="rejoindre">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{t('num')}</span>
        </div>
        <h2 className="sec-title">{t('title')}</h2>
        <RichText as="p" className="join-lead" path="rejoindre.lead" />

        <StatsCounter />

        <div className="join-cta">
          <RichText as="p" className="join-lead" path="rejoindre.facebookLead" />
          <div className="join-actions">
            <a
              className="jbtn jbtn-fb"
              href={social.facebookGroup}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="fb-glyph" aria-hidden="true">
                f
              </span>
              {cta('facebookGroup')}
            </a>
            <Link className="jbtn jbtn-ghost" href={`/${locale}/contribuer`}>
              📸&nbsp; {cta('contribute')}
            </Link>
          </div>

          <div className="share-row">
            <span>{t('shareLabel')}</span>
            <ShareBar />
          </div>

          <div className="join-quote">{t('quote')}</div>
        </div>
      </div>
    </section>
  );
}
