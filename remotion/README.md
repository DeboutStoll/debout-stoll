# Debout, Stoll ! — Remotion motion-graphics

Programmatic video (React → MP4) for the documentary, **isolated** from the
Next.js website: its own `package.json` and `node_modules`, so it never affects
the production build or Vercel deploy.

Two compositions, sharing the site's palette (`src/theme.ts`) so film and site
read as one production:

| id | What | Size / length |
|---|---|---|
| **AkonoTitle** | The "AKONO" studio cold-open: letterbox in, crest rises, title resolves from blur with a gold glow, rule draws, era tagline, fade. | 1920×1080 · 30fps · 9s |
| **StatDecline** | Animated data segment: the collapse from **1 500** pupils (2004) to **< 200** today — counting figure + two bars. | 1920×1080 · 30fps · 8s |

## Setup

```bash
cd remotion
npm install          # pulls Remotion + a headless Chromium for rendering
```

## Preview (live studio)

```bash
npm run studio       # opens Remotion Studio at http://localhost:3000
```
Scrub the timeline, tweak `defaultProps`, edit the `src/*.tsx` components and see
changes hot-reload.

## Render to MP4

```bash
npm run render:title   # → out/akono-title.mp4
npm run render:stat    # → out/stat-decline.mp4
npm run render:all
npm run still          # a poster frame → out/akono-title.png
```

## Where these go
- **Website**: use the rendered `akono-title.mp4` as a real opening clip, or embed
  a composition live in the React site with `@remotion/player` (add that dep to
  the *Next* app when you want an interactive, in-page player).
- **YouTube / social**: upload the MP4s as trailers / promos for the campaign.

## Customise
- **Text**: edit `defaultProps` in `src/Root.tsx` (or pass `--props` on render).
- **Colours**: `src/theme.ts` (mirrors the site's design tokens).
- **Crest**: `public/crest.png` (referenced via `staticFile('crest.png')`).
- **Fonts**: currently a system serif stack. For a locked, render-consistent
  font, add `@remotion/google-fonts` and load e.g. a serif in `src/theme.ts`.

## Notes
- Requires Node ≥ 18.17. First `npm install` downloads a Chromium (~large).
- Rendering uses the machine's GPU/CPU; CI rendering is possible via
  `@remotion/lambda` or a GitHub Action (not scaffolded here).
