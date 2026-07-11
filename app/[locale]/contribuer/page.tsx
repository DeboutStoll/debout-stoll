import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import ContributeForm from '@/components/ContributeForm';
import Footer from '@/components/Footer';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contribute' });
  return { title: `${t('title')} — Debout, Stoll !`, description: t('lead') };
}

export default function ContribuerPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <ContribuerBody locale={locale} />;
}

function ContribuerBody({ locale }: { locale: string }) {
  const t = useTranslations('contribute');
  return (
    <>
      <div className="subhero">
        <div className="wrap">
          <Link className="back" href={`/${locale}`}>
            {t('back')}
          </Link>
          <h1>{t('title')}</h1>
          <p>{t('lead')}</p>
        </div>
      </div>
      <section style={{ borderBottom: 'none' }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <ContributeForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
