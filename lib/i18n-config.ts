// Shared locale configuration used by middleware, request config, sitemap, etc.
export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

// Human labels for the language switcher.
export const localeLabels: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
};

// Full names for hreflang / metadata.
export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

export const localeHtmlLang: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en',
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://debout-stoll.org';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
