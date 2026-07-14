import { unstable_setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { siteUrl } from '@/lib/i18n-config';
import FilmIntro from '@/components/FilmIntro';
import Timeline from '@/components/Timeline';
import EgliseFeature from '@/components/EgliseFeature';
import Pantheon from '@/components/Pantheon';
import Voix from '@/components/Voix';
import Videos from '@/components/Videos';
import Gallery from '@/components/Gallery';
import Sources from '@/components/Sources';
import Constat from '@/components/Constat';
import Rejoindre from '@/components/Rejoindre';
import Footer from '@/components/Footer';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });

  // Schema.org — EducationalOrganization (kept from the original).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: "Collège Stoll d'Akono",
    alternateName: "Petit Séminaire Saint-Joseph d'Akono",
    description: t('description'),
    foundingDate: '1963-10-28',
    url: `${siteUrl}/${locale}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Akono',
      addressRegion: 'Centre',
      addressCountry: 'CM',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FilmIntro />
      <Timeline />
      <EgliseFeature />
      <Pantheon />
      <Voix />
      <Constat />
      <Videos />
      <Gallery />
      <Sources />
      <Rejoindre />
      <Footer />
    </>
  );
}
