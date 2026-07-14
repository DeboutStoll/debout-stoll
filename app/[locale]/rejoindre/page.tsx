import Link from 'next/link';
import type { Metadata } from 'next';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { social } from '@/content/social';
import { RichText } from '@/components/RichText';
import StatsCounter from '@/components/StatsCounter';
import ShareBar from '@/components/ShareBar';
import Footer from '@/components/Footer';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const messages = (await getMessages({ locale })) as {
    rejoindre: { title: string; lead: string };
  };
  return {
    title: `${messages.rejoindre.title} — Debout, Stoll !`,
    description: messages.rejoindre.lead.replace(/<[^>]+>/g, ''),
  };
}

export default function RejoindrePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <RejoindreBody locale={locale} />;
}

function RejoindreBody({ locale }: { locale: string }) {
  const t = useTranslations('rejoindre');
  const cta = useTranslations('cta');
  const common = useTranslations('common');
  return (
    <>
      <div className="subhero">
        <div className="wrap">
          <Link className="back" href={`/${locale}`}>
            {common('backHome')}
          </Link>
          <h1>{t('title')}</h1>
          <RichText as="p" path="rejoindre.lead" />
        </div>
      </div>
      <section id="rejoindre" style={{ borderBottom: 'none' }}>
        <div className="wrap">
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
      <Footer />
    </>
  );
}
