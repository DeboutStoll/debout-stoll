// Runs after `next build` (static export) to make the apex URL work on a
// static host that has no server-side redirects.
//
// Next exports /fr/index.html and /en/index.html but nothing at the root, so
// visiting https://debout-stoll.com/ would 404. We write an out/index.html that
// detects the visitor's language client-side and forwards to /fr/ or /en/
// (with a <meta refresh> + <noscript> fallback so it works without JS).
import { writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'out');

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Debout, Stoll !</title>
<link rel="canonical" href="https://debout-stoll.com/fr/">
<meta http-equiv="refresh" content="0; url=/fr/">
<script>
  try {
    var l = (navigator.language || 'fr').toLowerCase();
    location.replace(l.indexOf('en') === 0 ? '/en/' : '/fr/');
  } catch (e) { location.replace('/fr/'); }
</script>
</head>
<body style="background:#0f0c0a;color:#e9e0d2;font-family:Georgia,serif;text-align:center;padding:3rem">
  <p>Debout, Stoll ! — <a href="/fr/" style="color:#c9a24b">Entrer / Enter</a></p>
</body>
</html>
`;

try {
  await access(OUT);
} catch {
  console.error('[post-export] "out/" not found — did `next build` run with output:"export"?');
  process.exit(1);
}

await writeFile(join(OUT, 'index.html'), html, 'utf8');
console.log('[post-export] wrote out/index.html (apex → /fr or /en redirect)');
