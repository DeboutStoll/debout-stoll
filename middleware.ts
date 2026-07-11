import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n-config';

// Localised routing: every page lives under /fr or /en.
// The chosen locale is remembered in a cookie (NEXT_LOCALE) and the browser
// Accept-Language header is used for the first visit.
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export const config = {
  // Skip API routes, Next internals, and any file with an extension (assets).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
