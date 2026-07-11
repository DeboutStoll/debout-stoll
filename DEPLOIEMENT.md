# Déploiement end-to-end — Debout, Stoll !

Guide complet pour passer du test local à la **production sur
`debout-stoll.org`**, avec tous les services réels activés.

Deux cibles sont documentées :

1. **Vercel** (recommandé — le plus simple, HTTPS et CDN automatiques) ;
2. **Docker / auto-hébergement** (conteneur `standalone`).

Le backend (base, emails, anti-spam, analytics) est **entièrement optionnel** :
chaque service s'active en ajoutant ses variables d'environnement. Sans elles,
l'application tourne en mode local (magasin JSON + emails en console).

---

## 0. Vue d'ensemble des variables d'environnement

Copiez `.env.example` → `.env.local` (dev) ou renseignez-les dans votre hébergeur.

| Variable | Rôle | Sans elle |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique (canonical, hreflang, OG, sitemap) | `https://debout-stoll.org` |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Base de données (adhésions, contributions) | magasin JSON local `/data` |
| `SUPABASE_BUCKET` | Bucket de stockage des uploads | `contributions` |
| `MEMBER_BASE_COUNT` | Offset de départ du compteur (membres déjà recensés) | `0` |
| `RESEND_API_KEY` / `EMAIL_FROM` / `EMAIL_NOTIFY` | Emails transactionnels | emails journalisés en console |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Anti-bot (captcha invisible) | captcha ignoré |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analytics sans cookie | pas d'analytics |

---

## 1. Base de données — Supabase

1. Créez un projet sur **https://supabase.com** (région Europe conseillée : `eu-west`).
2. Dans **SQL Editor**, exécutez :

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

-- Sécurité : ces tables ne sont écrites que via la service-role key
-- (côté serveur). On laisse RLS activé sans policy publique.
alter table members enable row level security;
alter table contributions enable row level security;
```

3. **Storage** → créez un bucket **`contributions`** (privé). Les uploads
   arrivent dans `pending/`. Pour rendre une pièce publique après modération,
   déplacez-la ou générez une URL signée.
4. **Settings → API** : copiez `Project URL` → `SUPABASE_URL`, et la clé
   **`service_role`** (secrète) → `SUPABASE_SERVICE_ROLE_KEY`.

> La `service_role` ne doit **jamais** être exposée côté client : elle n'est
> utilisée que dans les route handlers (`app/api/*`) et `lib/db.ts`.

### Compteur temps réel (option avancée)

Le compteur interroge `/api/stats` toutes les 15 s (robuste, suffisant). Pour du
vrai temps réel, activez **Realtime** sur la table `members` dans Supabase et
abonnez-vous côté client — la logique de `StatsCounter.tsx` peut être remplacée
par un `supabase.channel(...)`.

### Export CSV des adhésions

Depuis Supabase : **Table Editor → members → Export → CSV**. (Ou `select * from
members order by created_at` puis « Download CSV ».)

---

## 2. Emails transactionnels — Resend

1. Créez un compte sur **https://resend.com**.
2. **Domains → Add Domain** : `debout-stoll.org`. Ajoutez les enregistrements
   **DKIM / SPF / MX** fournis dans votre DNS (voir §6).
3. **API Keys → Create** → `RESEND_API_KEY`.
4. Renseignez `EMAIL_FROM="Debout Stoll <contact@debout-stoll.org>"` et
   `EMAIL_NOTIFY=contact@debout-stoll.org` (adresse qui reçoit les notifications
   d'adhésion et de contribution).

À chaque adhésion : un email de **confirmation** part vers le membre + une
**notification** vers `EMAIL_NOTIFY`. À chaque contribution : une notification de
modération. Les envois sont *best-effort* — un incident n'empêche jamais
l'enregistrement.

---

## 3. Anti-spam — Cloudflare Turnstile (optionnel mais recommandé)

1. **Cloudflare → Turnstile → Add site** : domaine `debout-stoll.org`.
2. Copiez la **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` et la **Secret Key**
   → `TURNSTILE_SECRET_KEY`.
3. Sans ces clés, la vérification est ignorée. Avec elles, `lib/security.ts`
   valide le token côté serveur. (Le widget front peut être ajouté dans
   `JoinForm`/`ContributeForm` en lisant `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.)

Deux autres protections sont **toujours actives** : le **honeypot** (champ caché
`website`) et un **rate-limit** en mémoire (5 requêtes/min/IP pour l'adhésion,
4/min pour les contributions). Pour un rate-limit multi-région durable, branchez
Upstash Redis dans `lib/security.ts`.

---

## 4. Analytics respectueux — Plausible (optionnel)

1. Compte sur **https://plausible.io** (ou instance auto-hébergée), ajoutez le
   site `debout-stoll.org`.
2. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=debout-stoll.org`.
3. Sans cookie → **aucune bannière de consentement nécessaire**. Le script n'est
   chargé que si la variable est présente.

---

## 5. Déploiement sur Vercel (recommandé)

1. Poussez le dossier `sos-stoll/` sur un dépôt GitHub/GitLab.
2. **https://vercel.com → New Project → Import**. Vercel détecte Next.js
   automatiquement (Build: `next build`, aucune config à changer).
3. **Settings → Environment Variables** : ajoutez les variables du §0 (au
   minimum `NEXT_PUBLIC_SITE_URL`, puis Supabase, Resend, etc.). Cochez
   *Production* (et *Preview* si souhaité).
4. **Deploy**. Une URL `*.vercel.app` est générée — testez-y l'application.
5. Passez au domaine (§6).

> `output: 'standalone'` (dans `next.config.mjs`) est sans effet sur Vercel et
> parfait pour Docker — inutile de le retirer.

---

## 6. Domaine `debout-stoll.org` + HTTPS

### Sur Vercel
1. **Settings → Domains → Add** : `debout-stoll.org` et `www.debout-stoll.org`.
2. Chez votre registraire (Namecheap, OVH, Cloudflare…), pointez le DNS :
   - **Apex** `debout-stoll.org` → enregistrement **A** `76.76.21.21`
     *(ou suivez la valeur exacte affichée par Vercel)* ;
   - **www** → **CNAME** `cname.vercel-dns.com`.
3. Vercel provisionne le certificat **HTTPS (Let's Encrypt)** automatiquement.

### Enregistrements email (pour Resend, à ajouter au même DNS)
- **SPF** (TXT) : `v=spf1 include:resend.com ~all`
- **DKIM** (CNAME/TXT) : valeurs fournies par Resend.
- **MX** : uniquement si vous recevez le courrier via un fournisseur (ex. Google
  Workspace / Zoho). L'envoi via Resend ne requiert pas de MX.

> Le fichier `legacy/`… et les guides DNS d'origine
> (`GUIDE-EMAILS`, `DNS-COMPLET-debout-stoll`, `GUIDE-NAMECHEAP-GITHUB`) restent
> disponibles dans la bibliothèque du projet pour référence.

---

## 7. Déploiement Docker / auto-hébergement

L'application produit une **sortie `standalone`** (serveur Node autonome).

```bash
# Build & run
docker build -t debout-stoll .
docker run -p 3000:3000 --env-file .env.local \
  -v "$PWD/data:/app/data" -v "$PWD/public/uploads:/app/public/uploads" \
  debout-stoll

# ou, plus simple :
docker compose up --build
```

- Placez un **reverse-proxy** (Nginx, Caddy, Traefik) devant le conteneur pour
  le TLS. Exemple Caddy : `debout-stoll.org { reverse_proxy localhost:3000 }`.
- **En production, utilisez Supabase** plutôt que le magasin JSON local : le
  système de fichiers d'un conteneur est éphémère. Si vous restez en JSON,
  montez un **volume** persistant sur `/app/data` (et `/app/public/uploads`).

---

## 8. PWA — icônes propres

Les icônes actuelles (`public/icons/`) réutilisent l'écusson. Pour des tailles
exactes (192/512 + maskable), régénérez-les depuis
`public/img/crest-hires.png` :

```bash
# avec ImageMagick
convert public/img/crest-hires.png -resize 192x192 public/icons/icon-192.png
convert public/img/crest-hires.png -resize 512x512 public/icons/icon-512.png
# maskable : ajoutez une marge de sécurité (~10%) autour de l'écusson
```

Le manifeste est servi sur `/manifest.webmanifest`, le service worker sur
`/sw.js` (offline texte + images, actif en production uniquement).

---

## 9. Checklist post-déploiement

- [ ] `https://debout-stoll.org` redirige vers `/fr`, `/en` fonctionne.
- [ ] Sélecteur `FR|EN` conserve la page courante ; `hreflang` présents.
- [ ] Formulaire d'adhésion : enregistrement + email de confirmation reçu.
- [ ] Compteur d'adhésions augmente (`/api/stats`).
- [ ] Contribution : upload accepté, statut `pending` en base, notification reçue.
- [ ] Honeypot + rate-limit actifs ; Turnstile validé si configuré.
- [ ] **Lighthouse ≥ 90** (Performance / SEO / Accessibilité / PWA) — tester en
      navigation privée, hors mode data-light.
- [ ] PWA installable (icône = écusson) ; mode hors-ligne des pages visitées.
- [ ] Mode **data-light** dégrade bien (pas de grain, pas de Ken Burns).
- [ ] Open Graph / Twitter Card corrects (aperçu WhatsApp/Facebook).
- [ ] `sitemap.xml` et `robots.txt` accessibles.
- [ ] Page « Crédits & mentions légales » à jour (autorisations, RGPD).

---

## 10. Modération des contributions

Les contributions arrivent avec `status = 'pending'` et n'apparaissent **jamais**
publiquement sans validation. Flux recommandé :

1. Vous recevez la notification (email `EMAIL_NOTIFY`).
2. Dans Supabase (Table Editor `contributions`), examinez la pièce et le récit.
3. Pour publier : passez `status` à `published`, déplacez le fichier hors de
   `pending/` dans le bucket, puis ajoutez l'entrée correspondante dans
   `content/figures.ts` ou `content/gallery.ts` (bilingue) et redéployez.

> Objectif du modèle « contenu piloté par les données » : enrichir le panthéon
> et la galerie **sans toucher au code applicatif**.
