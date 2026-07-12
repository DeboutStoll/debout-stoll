import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import '../globals.css';
import {
  locales,
  localeHtmlLang,
  siteUrl,
  isLocale,
  type Locale,
} from '@/lib/i18n-config';
import Nav from '@/components/Nav';
import ScrollProgress from '@/components/ScrollProgress';
import RevealController from '@/components/RevealController';
import PwaRegister from '@/components/PwaRegister';
import Analytics from '@/components/Analytics';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0f0c0a',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const url = `${siteUrl}/${locale}`;

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    applicationName: 'Debout, Stoll !',
    manifest: '/manifest.webmanifest',
    alternates: {
      canonical: url,
      languages: {
        fr: `${siteUrl}/fr`,
        en: `${siteUrl}/en`,
        'x-default': `${siteUrl}/fr`,
      },
    },
    icons: {
      icon: [{ url: '/img/crest.png', type: 'image/png' }],
      apple: [{ url: '/icons/icon-192.png' }],
    },
    openGraph: {
      type: 'website',
      siteName: "SOS Collège Stoll d'Akono",
      title: t('ogTitle'),
      description: t('ogDescription'),
      url,
      locale: locale === 'en' ? 'en_GB' : 'fr_FR',
      images: [{ url: '/og/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ['/og/og-image.jpg'],
    },
  };
}

// Sets <html data-datalight> before paint to avoid a flash of heavy visuals.
const DATA_LIGHT_SCRIPT = `try{var v=localStorage.getItem('datalight');if(v==='true'||(v===null&&navigator.connection&&navigator.connection.saveData)){document.documentElement.dataset.datalight='true'}}catch(e){}`;

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(locale)) notFound();
  unstable_setRequestLocale(locale);
  const messages = useMessages();

  return (
    <html lang={localeHtmlLang[locale as Locale]}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: DATA_LIGHT_SCRIPT }} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a className="skip-link" href="#content">
            {locale === 'en' ? 'Skip to content' : 'Aller au contenu'}
          </a>
          <ScrollProgress />
          <Nav />
          <main id="content">{children}</main>
          <RevealController />
          <PwaRegister />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
