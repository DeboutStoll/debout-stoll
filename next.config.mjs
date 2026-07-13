import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Static HTML export → deployable to GitHub Pages (or any static host / CDN).
  // No Node server: API routes and middleware are not used (forms go to Zoho,
  // the counter reads Supabase directly from the browser).
  output: 'export',

  // GitHub Pages serves /fr/ as /fr/index.html — trailing slashes make every
  // route resolve to a real file.
  trailingSlash: true,

  images: {
    // No server-side image optimizer on a static host.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
