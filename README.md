# Debout, Stoll ! — application bilingue FR/EN

> Médiathèque du patrimoine et plateforme de mobilisation du **Collège Stoll
> d'Akono** et du Petit Séminaire Saint-Joseph. Migration de la page statique
> aboutie (`legacy/index.html`) vers **Next.js 14 (App Router, TypeScript)**,
> bilingue, avec backend réel — sans perte de design ni de contenu.

*(English version below — [jump to English](#english))*

---

## ✨ Ce qui est inclus

| Domaine | Détail |
|---|---|
| **Bilingue FR/EN** | `next-intl`, URLs `/fr` `/en`, `hreflang`, langue mémorisée (cookie + sélecteur `FR\|EN`). Tout le contenu traduit. |
| **Design conservé** | Design system porté **pixel-près** (générique « AKONO », grain, vignette, effet Ken Burns, écusson 3D, révélations au scroll, frise qui se remplit). Hero animé avec **Framer Motion**. |
| **Backend réel** | Adhésions en base, **compteur en temps quasi-réel**, emails de confirmation, anti-spam (honeypot + rate-limit + Turnstile optionnel), file de modération pour les contributions. |
| **Contribution mémoire** | Upload photo + témoignage → stockage → file de modération (n'est publié qu'après validation humaine). |
| **Contenu piloté par les données** | `content/*.ts` bilingues (figures, frise, galerie, citations, sources, inventaire) + `messages/{fr,en}.json`. **Ajouter une figure ou une photo = éditer un fichier, pas coder.** |
| **PWA & data-light** | Installable (écusson en icône), service worker offline, **mode léger** pour connexions limitées. |
| **Analytics respectueux** | Plausible (sans cookie), activé uniquement si configuré. |
| **SEO** | Open Graph, Twitter Card, Schema.org, `sitemap.xml`, `robots.txt`, `hreflang`. |
| **Déployable** | Vercel (recommandé) **ou conteneur Docker** (sortie `standalone`). |

> **Note :** la partie « dons en ligne » a été **retirée** à la demande de la
> maîtrise d'ouvrage. L'appel repose sur l'adhésion et la contribution mémoire.

---

## 🚀 Lancer en local (test immédiat, zéro configuration)

Prérequis : **Node.js ≥ 18.17**.

```bash
cd sos-stoll
npm install
npm run dev
```

Ouvrez **http://localhost:3000** → vous êtes redirigé vers `/fr`. Basculez en
`/en` avec le sélecteur `FR|EN`.

**Sans aucune variable d'environnement**, l'application fonctionne entièrement :
- les adhésions et contributions sont écrites dans un **magasin JSON local**
  (`/data/*.json`, ignoré par git) ;
- les emails sont **journalisés dans la console** au lieu d'être envoyés ;
- le captcha est désactivé, les analytics sont désactivés.

C'est le mode idéal pour tester. Pour activer les vrais services (Supabase,
Resend, Turnstile, Plausible), voir **[DEPLOIEMENT.md](./DEPLOIEMENT.md)**.

### Build de production en local

```bash
npm run build      # build Next.js (sortie standalone)
npm start          # NB : pour la sortie standalone, préférez :
node .next/standalone/server.js   # (après avoir copié .next/static et public — voir Dockerfile)
```

### Conteneur

```bash
docker compose up --build     # http://localhost:3000
# ou
docker build -t debout-stoll . && docker run -p 3000:3000 --env-file .env.local debout-stoll
```

---

## 📚 Guides de déploiement (`debout-stoll.com`)

Tout ce qu'il faut pour passer du local à la production, du plus rapide au plus détaillé :

| Guide | À quoi il sert |
|---|---|
| **[GO-LIVE.md](./GO-LIVE.md)** · [🇬🇧 EN](./GO-LIVE.en.md) | **Commencez ici.** Runbook condensé, étape par étape avec cases à cocher (sécurité → Supabase → Resend → Vercel → DNS → vérification). |
| **[WALKTHROUGH-SUPABASE-RESEND.md](./WALKTHROUGH-SUPABASE-RESEND.md)** | Création des comptes backend, écran par écran → produit les 3 secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`). |
| **[WALKTHROUGH-VERCEL.md](./WALKTHROUGH-VERCEL.md)** | Déploiement Vercel + domaine, écran par écran (import, Root Directory, variables, DNS, HTTPS). |
| **[DEPLOIEMENT.md](./DEPLOIEMENT.md)** | Référence complète : variables, scalabilité/cache mondial, Docker/auto-hébergement, supervision, modération. |
| **[supabase/schema.sql](./supabase/schema.sql)** | Schéma base prêt à coller (tables + index + RLS + bucket), idempotent. |
| **[.env.example](./.env.example)** | Référence de toutes les variables d'environnement. |

**Ordre conseillé :** Supabase/Resend → Vercel → DNS Namecheap (GO-LIVE §4) → checklist de vérification.

---

## 🗂️ Architecture

```
sos-stoll/
├─ app/
│  ├─ [locale]/            layout · page (accueil) · rejoindre · contribuer · credits
│  ├─ api/                 join · stats · contribute
│  ├─ manifest.ts · sitemap.ts · robots.ts · globals.css
├─ components/             Hero · Nav · LangSwitch · Timeline · Pantheon · Gallery
│                          Videos · Constat · Rejoindre · JoinForm · ContributeForm
│                          StatsCounter · ShareBar · CineIntro · ScrollProgress …
├─ content/               figures.ts · timeline.ts · gallery.ts · quotes.ts · sources.ts
│                         inventory.ts · videos.ts  (tous bilingues)
├─ messages/              fr.json · en.json          (chaînes d'interface)
├─ lib/                   db.ts · email.ts · security.ts · i18n-config.ts
├─ public/img/            photos d'archives extraites de la page originale
├─ supabase/schema.sql    schéma base prêt à coller (idempotent)
├─ legacy/index.html      page statique d'origine, conservée intacte
├─ Dockerfile · docker-compose.yml
└─ GO-LIVE.md · GO-LIVE.en.md · WALKTHROUGH-VERCEL.md
   WALKTHROUGH-SUPABASE-RESEND.md · DEPLOIEMENT.md   (guides de déploiement)
```

## ✍️ Ajouter une figure / une photo sans coder

1. Déposez l'image dans `public/img/` (ex. `public/img/ma-figure.jpg`).
2. Ajoutez une entrée dans `content/figures.ts` (ou `content/gallery.ts`), avec
   les champs `fr` et `en`. C'est tout — elle apparaît des deux côtés.

Le script `npm run extract:legacy` ré-extrait les images de `legacy/index.html`
si besoin (la source de vérité reste la page originale).

## ✅ Exactitude historique

Les faits sont **verrouillés** (cf. `PROMPT-sos-stoll-app.md` §5) : Père Stoll
(mission 1923), Petit Séminaire St-Joseph, fondation du Collège le 28 oct. 1963
par Mgr Jean Zoa, inauguration du 23 fév. 1969 par **M. Paul Biya, Secrétaire
Général à la Présidence et ancien séminariste** (jamais « président » en 1969),
départ des Maristes 2004, renaissance du séminaire 2018, Kayou (Kayou Roots).

## ♿ Accessibilité & éthique

WCAG 2.1 AA visé : `prefers-reduced-motion` respecté, focus visibles, `alt` sur
toutes les images, lien d'évitement, contrastes soignés. RGPD respecté (données
réservées au réseau, page « Crédits & mentions légales »).

---

<a name="english"></a>
## English

Bilingual (FR/EN) Next.js 14 app migrated pixel-close from the finished static
page (`legacy/index.html`) into the App Router with TypeScript, adding a real
backend: memberships in a database, a near-real-time counter, confirmation
emails, anti-spam, and a moderated memory-contribution flow. Design identity
(the "AKONO" intro, film grain, Ken Burns, 3D crest, scroll reveals, filling
timeline) is preserved; the hero is animated with Framer Motion. Installable
PWA with a data-light mode for limited connections. Online **donations were
removed** at the client's request.

**Run locally (no configuration needed):**

```bash
cd sos-stoll && npm install && npm run dev   # → http://localhost:3000
```

With no environment variables the app is fully functional: memberships and
contributions go to a local JSON store, emails are logged to the console, and
captcha/analytics stay off.

**Going to production on `debout-stoll.com`?** Start with the step-by-step
runbook **[GO-LIVE.en.md](./GO-LIVE.en.md)**, backed by screen-by-screen guides
for the backends (**[WALKTHROUGH-SUPABASE-RESEND.md](./WALKTHROUGH-SUPABASE-RESEND.md)**)
and Vercel (**[WALKTHROUGH-VERCEL.md](./WALKTHROUGH-VERCEL.md)**). Full reference:
**[DEPLOIEMENT.md](./DEPLOIEMENT.md)**.

**Add a figure or photo without coding:** drop an image in `public/img/` and add
a bilingual entry to `content/figures.ts` or `content/gallery.ts`.

---

*Médiathèque du patrimoine · Réseau des anciens du Collège Stoll d'Akono ·
[debout-stoll.com](https://debout-stoll.com)*
