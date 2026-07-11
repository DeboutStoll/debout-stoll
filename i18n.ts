import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { isLocale } from './lib/i18n-config';

// Loads the message catalogue for the active locale (next-intl request config).
export default getRequestConfig(async ({ locale }) => {
  if (!isLocale(locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Africa/Douala',
  };
});
