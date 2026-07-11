import type { MetadataRoute } from 'next';

// Installable PWA manifest — icon is the college crest. Served at
// /manifest.webmanifest.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Debout, Stoll ! — Collège Stoll d’Akono',
    short_name: 'Debout Stoll',
    description:
      "Médiathèque du patrimoine et plateforme de mobilisation du Collège Stoll d'Akono.",
    start_url: '/fr',
    scope: '/',
    display: 'standalone',
    background_color: '#0f0c0a',
    theme_color: '#0f0c0a',
    lang: 'fr',
    categories: ['education', 'nonprofit', 'reference'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
