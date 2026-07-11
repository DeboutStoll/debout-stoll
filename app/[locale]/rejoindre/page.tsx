import Link from 'next/link';
import type { Metadata } from 'next';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { RichText } from '@/components/RichText';
import StatsCounter from '@/components/StatsCounter';
import JoinForm from '@/components/JoinForm';
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
          <div className="join-grid">
            <div>
              <div className="share-row" style={{ marginTop: 0 }}>
                <span>{t('shareLabel')}</span>
                <ShareBar />
              </div>
              <div className="join-quote">{t('quote')}</div>
            </div>
            <JoinForm />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
