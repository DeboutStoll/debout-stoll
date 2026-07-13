# Déploiement end-to-end — Debout, Stoll !

Guide complet, pas à pas, pour mettre **`debout-stoll.com`** en production :
robuste, hautement disponible et accessible depuis n'importe quel appareil
partout dans le monde.

**Pile retenue** — la plus simple et la plus scalable pour cette application :

| Rôle | Service | Pourquoi |
|---|---|---|
| Hébergement + CDN mondial + HTTPS | **Vercel** | Réseau edge mondial, HTTPS automatique, mise à l'échelle et répartition de charge automatiques, zéro serveur à maintenir. |
| Base de données | **Supabase** (Postgres) | Stockage durable des adhésions et contributions ; survit aux redéploiements. |
| Emails transactionnels | **Resend** | Confirmations d'adhésion + notifications de modération. |
| Code source | **GitHub** — org [`DeboutStoll`](https://github.com/DeboutStoll) | Chaque `git push` redéploie automatiquement. |
| DNS du domaine | **Namecheap** | Où est enregistré `debout-stoll.com`. |

Anti-spam (Turnstile) et analytics (Plausible) sont **optionnels** — voir §8–9.

> **Pourquoi c'est déjà « scalable mondialement »** : toutes les pages de contenu
> sont **pré-rendues en HTML statique** (voir la sortie de `next build` : `●
> SSG`). Vercel les sert depuis son **CDN edge** au plus près de chaque
> visiteur — Douala, Paris, Montréal ou Sydney reçoivent la même page en
> quelques millisecondes, sans calcul serveur. Seuls les envois de
> formulaires touchent l'origine.

---

## 0. Prérequis (comptes à créer)

- [ ] Compte **GitHub** — accès à l'org [`DeboutStoll`](https://github.com/DeboutStoll).
- [ ] Compte **Vercel** (connectez-le à GitHub) — https://vercel.com
- [ ] Compte **Supabase** — https://supabase.com
- [ ] Compte **Resend** — https://resend.com
- [ ] Accès au **DNS Namecheap** de `debout-stoll.com` (onglet *Advanced DNS*).

---

## 0 bis. ⚠️ Sécurité des secrets — à lire avant tout

Un **token GitHub (PAT)** a été partagé en clair pendant la préparation. Un
secret exposé en clair est **compromis** :

1. **Révoquez-le immédiatement** : https://github.com/settings/tokens → *Delete*.
2. Créez-en un nouveau (*Fine-grained token*, accès limité au dépôt, expiration courte).
3. **Ne le collez jamais dans un chat, un fichier versionné ou une capture.**
   Utilisez-le uniquement dans le gestionnaire d'identifiants git local (§1).

Même règle pour la **clé `service_role` Supabase**, la **clé Resend** et la
**clé secrète Turnstile** : elles ne vivent que dans les *Environment
Variables* de Vercel, jamais dans le code ni dans Git (le `.gitignore`
exclut déjà `.env*.local`).

---

## 1. Pousser le code sur GitHub (org DeboutStoll)

Le dépôt versionne **le dossier `sos-stoll/`**.

```bash
cd sos-stoll

# 1. Créez le dépôt vide côté GitHub : https://github.com/organizations/DeboutStoll/repositories/new
#    Nom suggéré : "debout-stoll" — privé ou public au choix.

# 2. Initialisez (si ce n'est pas déjà un dépôt git) et poussez :
git init
git add .
git commit -m "Debout, Stoll ! — prêt pour la production"
git branch -M main
git remote add origin https://github.com/DeboutStoll/debout-stoll.git
git push -u origin main
```

**Authentification (sans exposer le token)** — au `git push`, GitHub demande
identifiant + mot de passe : mettez votre login GitHub et **collez le PAT
comme mot de passe**. Pour ne le saisir qu'une fois, activez le cache :

```bash
git config --global credential.helper store   # ou 'cache' pour un cache temporaire en mémoire
```

> Le fichier `.env.local` (secrets) **n'est jamais poussé** — il est ignoré par
> `.gitignore`. Vérifiez avant le premier push : `git status` ne doit montrer
> aucun `.env*.local`.

---

## 2. Base de données — Supabase

1. **New project** sur https://supabase.com (région conseillée : **`eu-west` /
   Europe** — bon compromis latence Cameroun ↔ Europe).
2. **SQL Editor → New query** → collez le contenu de **`supabase/schema.sql`**
   (fichier prêt à l'emploi, idempotent : il crée les tables, index, RLS **et**
   le bucket de stockage) → *Run*. Le SQL est également reproduit ci-dessous
   pour référence :

```sql
-- Table des adhésions
create table if not exists members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  promotion   text,
  city        text,
  email       text not null,
  message     text,
  locale      text default 'fr',
  created_at  timestamptz default now()
);
-- Empêche les doublons d'email au niveau base (robuste, quelle que soit la charge).
create unique index if not exists members_email_uidx on members (lower(email));

-- File de modération des contributions mémoire
create table if not exists contributions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  kind        text not null default 'photo',
  title       text not null,
  story       text,
  file_url    text,
  status      text not null default 'pending',  -- pending | published | rejected
  locale      text default 'fr',
  created_at  timestamptz default now()
);

-- Sécurité : ces tables ne sont écrites que via la service-role key (côté
-- serveur). RLS activé, aucune policy publique → aucune lecture/écriture
-- possible depuis le client.
alter table members enable row level security;
alter table contributions enable row level security;
```

3. **Storage** → créez un bucket **`contributions`** (privé). Les uploads
   arrivent dans `pending/` ; on ne les rend publics qu'après modération (§13).
4. **Settings → API** : copiez `Project URL` → `SUPABASE_URL`, et la clé
   **`service_role`** (secrète) → `SUPABASE_SERVICE_ROLE_KEY`.

> ⚠️ La `service_role` contourne RLS : elle ne doit **jamais** être exposée
> côté client. Elle n'est lue que dans `app/api/*` et `lib/db.ts` (serveur).

**Compteur d'adhésions** : `MEMBER_BASE_COUNT` fixe le point de départ du
compteur public (nombre d'anciens déjà recensés hors ligne). Ex. `MEMBER_BASE_COUNT=250`.

**Export CSV** : Supabase → *Table Editor → members → Export → CSV*.

---

## 3. Emails transactionnels — Resend

1. Compte sur https://resend.com → **Domains → Add Domain** : `debout-stoll.com`.
2. Resend affiche des enregistrements **DKIM**, **SPF** et **Return-Path/MX de
   rebond** : notez-les, vous les ajouterez chez Namecheap au §5.
3. **API Keys → Create** → valeur `re_…` → variable `RESEND_API_KEY`.
4. Variables :
   - `EMAIL_FROM=Debout Stoll <contact@debout-stoll.com>`
   - `EMAIL_NOTIFY=contact@debout-stoll.com` (reçoit les notifications d'adhésion
     et de contribution).

À chaque adhésion : email de **confirmation** au membre + **notification** à
`EMAIL_NOTIFY`. À chaque contribution : notification de modération. Les envois
sont *best-effort* — un incident email n'empêche **jamais** l'enregistrement.

---

## 4. Déploiement sur Vercel

1. https://vercel.com → **Add New… → Project → Import** le dépôt
   `DeboutStoll/debout-stoll`.
2. Vercel détecte **Next.js** automatiquement. Si le dépôt contient d'autres
   dossiers à la racine, réglez **Root Directory = `sos-stoll`**.
   (Build `next build`, Output automatique — rien d'autre à changer.)
3. **Settings → Environment Variables** → ajoutez, pour l'environnement
   **Production** (cf. §0 ter), au minimum :

   | Variable | Valeur |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://debout-stoll.com` |
   | `SUPABASE_URL` | *(Supabase → Project URL)* |
   | `SUPABASE_SERVICE_ROLE_KEY` | *(Supabase → service_role)* |
   | `SUPABASE_BUCKET` | `contributions` |
   | `MEMBER_BASE_COUNT` | ex. `250` |
   | `RESEND_API_KEY` | *(Resend → API key `re_…`)* |
   | `EMAIL_FROM` | `Debout Stoll <contact@debout-stoll.com>` |
   | `EMAIL_NOTIFY` | `contact@debout-stoll.com` |

4. **Deploy**. Une URL `debout-stoll-*.vercel.app` est générée — testez-la avant
   de brancher le domaine.

> `output: 'standalone'` (dans `next.config.mjs`) est ignoré par Vercel et
> réservé à Docker (§12) — inutile de le retirer.

### 0 ter. Toutes les variables d'environnement

| Variable | Rôle | Sans elle |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique (canonical, hreflang, OG, sitemap) | `https://debout-stoll.com` |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Base de données | magasin JSON local `/data` (dev only) |
| `SUPABASE_BUCKET` | Bucket des uploads | `contributions` |
| `MEMBER_BASE_COUNT` | Offset de départ du compteur | `0` |
| `RESEND_API_KEY` / `EMAIL_FROM` / `EMAIL_NOTIFY` | Emails | journalisés en console |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Anti-bot | captcha ignoré |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analytics sans cookie | pas d'analytics |

`NEXT_PUBLIC_*` = exposées au navigateur (jamais de secret). Les autres restent côté serveur.

---

## 5. Domaine `debout-stoll.com` — DNS Namecheap + HTTPS

### 5.1 Brancher le domaine sur Vercel
1. Vercel → **Settings → Domains → Add** : ajoutez `debout-stoll.com` **et**
   `www.debout-stoll.com`.
2. Vercel choisit `www` ou l'apex comme principal et affiche les valeurs DNS
   exactes à créer. **Utilisez toujours les valeurs affichées par Vercel** si
   elles diffèrent de celles ci-dessous.

### 5.2 Chez Namecheap → *Domain List → Manage → Advanced DNS*
**Supprimez d'abord** les enregistrements de parking par défaut (le `CNAME` `www
→ parkingpage` et l'`URL Redirect`), puis créez :

| Type | Host | Value | TTL |
|---|---|---|---|
| **A Record** | `@` | `76.76.21.21` *(ou la valeur exacte de Vercel)* | Automatic |
| **CNAME Record** | `www` | `cname.vercel-dns.com.` | Automatic |

> Namecheap n'autorise pas de CNAME sur l'apex (`@`) : c'est pourquoi l'apex
> utilise un **A record**. Vercel provisionne le certificat **HTTPS (Let's
> Encrypt)** automatiquement dès que le DNS pointe — propagation : quelques
> minutes à ~1 h.

### 5.3 Enregistrements email Resend (même écran Advanced DNS)
Ajoutez **exactement** ceux fournis par Resend (§3). En général :

| Type | Host (exemple) | Value |
|---|---|---|
| TXT (SPF) | `send` (ou `@`) | `v=spf1 include:amazonses.com ~all` *(valeur Resend)* |
| TXT / CNAME (DKIM) | `resend._domainkey` | *(valeur Resend)* |
| MX (rebonds) | `send` | `feedback-smtp.<region>.amazonses.com` (priorité 10) |

> Un **MX pour recevoir** le courrier `@debout-stoll.com` n'est nécessaire que
> si vous voulez une **boîte de réception** (ex. Zoho Mail gratuit, Google
> Workspace). L'**envoi** via Resend n'en a pas besoin. Pour recevoir sur
> `contact@debout-stoll.com`, configurez le fournisseur de votre choix et
> ajoutez ses MX ici.

---

## 6. Scalabilité, mise en cache & disponibilité mondiale

Ce qui rend le site rapide et robuste partout, **déjà en place** :

- **Pages statiques + CDN edge (Vercel)** — les pages `/fr`, `/en`, `/rejoindre`,
  `/contribuer`, `/credits` sont pré-rendues et servies depuis le nœud edge le
  plus proche du visiteur. Montée en charge quasi illimitée sans serveur.
- **Cache des médias** — crest, galerie, images OG et icônes (`/img`, `/og`,
  `/icons`) portent un `Cache-Control: public, max-age=86400,
  s-maxage=604800, stale-while-revalidate=604800` (voir `next.config.mjs`) :
  mis en cache une semaine à l'edge, servis instantanément.
- **Compteur d'adhésions mutualisé** — `/api/stats` renvoie
  `s-maxage=10, stale-while-revalidate=30` : une rafale de visiteurs dans une
  région se résout en **~1 lecture base toutes les 10 s par région**, au lieu
  d'une par sondage. La base ne subit jamais la charge des lecteurs.
- **Images optimisées** — `next/image` sert de l'AVIF/WebP redimensionné (voir
  `next.config.mjs > images`).
- **Mode `data-light`** — dégrade automatiquement grain, Ken Burns et vidéos sur
  connexions lentes/limitées (utile au Cameroun). Bascule manuelle également.
- **PWA + service worker** — pages et images déjà visitées disponibles **hors
  ligne** ; l'app est installable sur mobile.

### À activer si le trafic devient très élevé (optionnel)
- **Rate-limit durable multi-région** — le limiteur actuel (`lib/security.ts`)
  est **en mémoire par instance** : suffisant contre les floods naïfs, mais non
  partagé entre les multiples fonctions serverless de Vercel. Pour un plafond
  strict à grande échelle, branchez **Upstash Redis** (gratuit, edge) dans
  `rateLimit()`. Les protections **honeypot**, **index unique email** et
  **Turnstile** restent efficaces sans cela.
- **ISR** — si vous rendez du contenu éditable via la base, passez les pages en
  `revalidate` plutôt que 100 % statique.

---

## 7. Anti-spam — Cloudflare Turnstile (optionnel, recommandé)

1. **Cloudflare → Turnstile → Add site** : `debout-stoll.com`.
2. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (publique) + `TURNSTILE_SECRET_KEY` (secrète).
3. Sans ces clés, la vérification est ignorée. Avec elles, `lib/security.ts`
   valide le token côté serveur.

Toujours actifs même sans Turnstile : **honeypot** (champ caché `website`) et
**rate-limit** (5 req/min/IP pour l'adhésion, 4/min pour les contributions).

---

## 8. Analytics respectueux — Plausible (optionnel)

1. https://plausible.io → ajoutez le site `debout-stoll.com`.
2. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=debout-stoll.com`.
3. Sans cookie → **aucune bannière de consentement nécessaire**. Le script n'est
   chargé que si la variable est présente.

---

## 9. Santé & supervision

- **Endpoint de santé** : `GET /api/health` → `{"status":"ok","backend":"supabase"}`.
  Il **ne touche pas la base** (une panne base ne fait pas passer le site
  « down » à tort).
- Branchez un moniteur gratuit (**UptimeRobot**, **Better Stack**) sur
  `https://debout-stoll.com/api/health` (intervalle 1–5 min, alerte email/SMS).
- Docker : un `HEALTHCHECK` interroge déjà ce endpoint (voir `Dockerfile`).
- Logs & erreurs runtime : Vercel → onglet **Logs** / **Observability**.

---

## 10. PWA — icônes propres

Les icônes (`public/icons/`) reprennent l'écusson. Pour des tailles exactes
(192 / 512 + maskable) régénérez-les depuis `public/img/crest-hires.png` :

```bash
convert public/img/crest-hires.png -resize 192x192 public/icons/icon-192.png
convert public/img/crest-hires.png -resize 512x512 public/icons/icon-512.png
# maskable : prévoir ~10 % de marge de sécurité autour de l'écusson.
```

Manifeste servi sur `/manifest.webmanifest`, service worker sur `/sw.js`
(offline texte + images, actif en production uniquement).

---

## 11. Checklist post-déploiement

- [ ] `https://debout-stoll.com` charge en HTTPS (cadenas) et redirige `/` → `/fr`.
- [ ] `www.debout-stoll.com` redirige vers l'apex (ou l'inverse, cohérent).
- [ ] `/en` fonctionne ; sélecteur `FR|EN` conserve la page ; `hreflang` présents.
- [ ] **Responsive** : tester en vrai sur mobile (portrait/paysage), tablette,
      desktop — ou DevTools *device toolbar* (iPhone SE 375 px, Pixel, iPad).
      Nav qui passe à la ligne, aucun débordement horizontal, cibles tactiles OK.
- [ ] Adhésion : enregistrement en base + email de confirmation reçu + notif à
      `EMAIL_NOTIFY`.
- [ ] Compteur d'adhésions augmente après un envoi (`/api/stats`).
- [ ] Contribution : upload accepté, statut `pending` en base, notification reçue.
- [ ] `GET /api/health` → `{"status":"ok"}` ; moniteur uptime branché.
- [ ] Honeypot + rate-limit actifs ; Turnstile validé si configuré.
- [ ] En-têtes sécurité présents (`curl -sI https://debout-stoll.com` →
      `strict-transport-security`, `x-content-type-options`, `x-frame-options`,
      `permissions-policy`).
- [ ] **Lighthouse ≥ 90** (Performance / SEO / Accessibilité / PWA) — navigation
      privée, hors mode data-light.
- [ ] Aperçu **Open Graph / Twitter** correct (test WhatsApp/Facebook/LinkedIn).
- [ ] `https://debout-stoll.com/sitemap.xml` et `/robots.txt` accessibles et en `.com`.
- [ ] Page « Crédits & mentions légales » à jour (autorisations, RGPD, contact).

---

## 12. Déploiement Docker / auto-hébergement (alternative)

L'application produit une **sortie `standalone`** (serveur Node autonome).

```bash
docker build -t debout-stoll .
docker run -p 3000:3000 --env-file .env.local \
  -v "$PWD/data:/app/data" -v "$PWD/public/uploads:/app/public/uploads" \
  debout-stoll
# ou : docker compose up --build
```

- Placez un **reverse-proxy** (Caddy/Nginx/Traefik) devant pour le TLS. Caddy :
  `debout-stoll.com { reverse_proxy localhost:3000 }`.
- **Utilisez Supabase** en prod : le système de fichiers d'un conteneur est
  éphémère. En JSON, montez un **volume** persistant sur `/app/data`.
- Sans le CDN de Vercel, ajoutez Cloudflare devant pour le cache mondial.

---

## 13. Modération des contributions

`status = 'pending'` par défaut — rien n'apparaît publiquement sans validation.

1. Vous recevez la notification (email `EMAIL_NOTIFY`).
2. Supabase → *Table Editor `contributions`* : examinez pièce + récit.
3. Pour publier : `status = 'published'`, déplacez le fichier hors de `pending/`
   dans le bucket, ajoutez l'entrée bilingue dans `content/figures.ts` ou
   `content/gallery.ts`, puis **`git push`** (Vercel redéploie tout seul).

> Modèle « contenu piloté par les données » : on enrichit le panthéon et la
> galerie **sans toucher au code applicatif**.

---

## 14. Exploitation courante

- **Modifier le contenu** → éditez les fichiers `content/*.ts` (bilingues) ou
  `messages/{fr,en}.json`, `git commit`, `git push` → redéploiement automatique.
- **Revenir en arrière** → Vercel → *Deployments* → un déploiement précédent →
  *Promote to Production* (rollback instantané).
- **Prévisualiser une modif** → chaque branche/PR obtient une URL de *Preview*
  Vercel avant la mise en production.
- **Rotation des secrets** → changez la valeur dans Vercel → *Environment
  Variables* → **Redeploy** pour appliquer.
