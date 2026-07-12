import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { social } from '@/content/social';
import { RichText } from './RichText';
import StatsCounter from './StatsCounter';
import JoinForm from './JoinForm';
import ShareBar from './ShareBar';

// Section IX — Rejoindre l'appel: live stats, membership form, share.
// (Donations intentionally removed.)
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

        <div className="join-grid">
          <div>
            <p className="join-lead" style={{ marginTop: 0 }}>
              {t('actionsLead')}
            </p>
            <div className="join-actions">
              <a className="jbtn jbtn-primary" href="#adhesion">
                ✎&nbsp; {cta('join')}
              </a>
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

          <JoinForm />
        </div>
      </div>
    </section>
  );
}
