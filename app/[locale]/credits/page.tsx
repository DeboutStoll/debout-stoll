import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'credits' });
  return { title: `${t('title')} — Debout, Stoll !`, description: t('intro') };
}

export default function CreditsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <CreditsBody locale={locale} />;
}

function CreditsBody({ locale }: { locale: string }) {
  const t = useTranslations('credits');
  return (
    <>
      <div className="subhero">
        <div className="wrap">
          <Link className="back" href={`/${locale}`}>
            {t('back')}
          </Link>
          <h1>{t('title')}</h1>
          <p>{t('intro')}</p>
        </div>
      </div>
      <section style={{ borderBottom: 'none' }}>
        <div className="wrap prose">
          <h2>{t('sourcesTitle')}</h2>
          <p>{t('sourcesBody')}</p>
          <h2>{t('rightsTitle')}</h2>
          <p>{t('rightsBody')}</p>
          <h2>{t('privacyTitle')}</h2>
          <p>{t('privacyBody')}</p>
          <h2>{t('editorTitle')}</h2>
          <p>{t('editorBody')}</p>
          <p>
            <a href="mailto:contact@debout-stoll.com">{t('contact')}</a>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
