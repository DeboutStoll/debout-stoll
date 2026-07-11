import type { MetadataRoute } from 'next';
import { locales, siteUrl } from '@/lib/i18n-config';

const paths = ['', '/rejoindre', '/contribuer', '/credits'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
          ),
        },
      });
    }
  }
  return entries;
}
