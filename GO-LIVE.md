# GO-LIVE — Debout, Stoll ! → `debout-stoll.com`

Runbook condensé pour la mise en production. Pour les détails et alternatives,
voir **`DEPLOIEMENT.md`**. Suivez les étapes **dans l'ordre** et cochez au fur
et à mesure. Compter ~30–45 min (hors propagation DNS).

**Pile** : GitHub (`DeboutStoll/debout-stoll`) → Vercel (hébergement + CDN
mondial + HTTPS) → Supabase (base) → Resend (emails) → Namecheap (DNS).

---

## ✅ Déjà fait
- [x] Dépôt GitHub créé : **https://github.com/DeboutStoll/debout-stoll** (privé).
- [x] Code poussé sur `main` (durci pour la prod : domaine `.com`, en-têtes de
      sécurité, cache edge, `/api/health`).
- [x] `supabase/schema.sql` prêt à exécuter.
- [x] Gabarit `.env.local` en place (local uniquement, git-ignoré).

---

## 0. 🔴 Sécurité — d'abord
- [ ] **Révoquer** le token GitHub partagé en clair : https://github.com/settings/tokens
- [ ] Créer un nouveau **fine-grained token** (accès au seul dépôt, expiration courte).
- [ ] Ne jamais coller un secret (`service_role`, clé Resend, PAT) dans un chat,
      un fichier versionné ou une capture. Ils ne vivent que dans les variables
      d'environnement Vercel.

---

## 1. Base de données — Supabase
- [ ] **New project** sur https://supabase.com (région **Europe / `eu-west`**).
- [ ] **SQL Editor → New query** → coller **tout `supabase/schema.sql`** → *Run*.
      (Idempotent : rejouable sans risque. Crée tables + index + RLS + bucket.)
- [ ] **Settings → API** : noter `Project URL` et la clé **`service_role`** (secrète).
- [ ] Vérifier : `select count(*) from public.members;` renvoie `0`.

---

## 2. Emails — Resend
- [ ] Compte https://resend.com → **Domains → Add Domain** : `debout-stoll.com`.
- [ ] Noter les enregistrements **SPF / DKIM / MX** affichés (pour l'étape 4 DNS).
- [ ] **API Keys → Create** → noter la clé `re_…` (secrète).

---

## 3. Hébergement — Vercel
- [ ] https://vercel.com → **Add New → Project → Import** `DeboutStoll/debout-stoll`.
- [ ] Si demandé : **Root Directory = `sos-stoll`**. (Framework Next.js auto-détecté.)
- [ ] **Settings → Environment Variables** → coller le bloc ci-dessous et **remplir
      les valeurs vides** ; cocher **Production** *et* **Preview** :

```bash
NEXT_PUBLIC_SITE_URL=https://debout-stoll.com
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=contributions
MEMBER_BASE_COUNT=0
RESEND_API_KEY=
EMAIL_FROM=Debout Stoll <contact@debout-stoll.com>
EMAIL_NOTIFY=contact@debout-stoll.com
```

| Clé | Valeur | Source | Secret |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://debout-stoll.com` | fixe | non |
| `SUPABASE_URL` | *Project URL* | Supabase → API | non |
| `SUPABASE_SERVICE_ROLE_KEY` | *service_role* | Supabase → API | 🔒 oui |
| `SUPABASE_BUCKET` | `contributions` | fixe | non |
| `MEMBER_BASE_COUNT` | ex. `250` (0 si aucun) | vous | non |
| `RESEND_API_KEY` | `re_…` | Resend → API Keys | 🔒 oui |
| `EMAIL_FROM` | `Debout Stoll <contact@debout-stoll.com>` | fixe | non |
| `EMAIL_NOTIFY` | `contact@debout-stoll.com` | fixe | non |

- [ ] **Deploy**. Tester d'abord sur l'URL `*.vercel.app` générée.
- [ ] Toute modif de variable ⇒ **Redeploy** (les variables ne s'appliquent pas
      rétroactivement à un build existant).

> `NEXT_PUBLIC_*` = exposées au navigateur (jamais de secret). Les autres restent côté serveur.
> Optionnel plus tard : `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`
> (anti-spam), `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=debout-stoll.com` (analytics).

---

## 4. Domaine — DNS Namecheap
Vercel → **Settings → Domains → Add** : `debout-stoll.com` **et** `www.debout-stoll.com`.
Puis Namecheap → **Domain List → Manage → Advanced DNS** (nameservers = *Namecheap BasicDNS*).

**🗑️ Supprimer** les enregistrements de parking par défaut :

| Type | Host | Value (typique) |
|---|---|---|
| CNAME Record | `www` | `parkingpage.namecheap.com.` |
| URL Redirect | `@` | `http://www.debout-stoll.com/` |
| A Record *(si présent)* | `@` | IP de parking Namecheap |

**➕ Ajouter** (site — Vercel) :

| Type | Host | Value | TTL |
|---|---|---|---|
| A Record | `@` | `76.76.21.21` *(ou valeur exacte Vercel)* | Automatic |
| CNAME Record | `www` | `cname.vercel-dns.com.` | Automatic |

**➕ Ajouter** (email — Resend, valeurs **exactes** du dashboard Resend) :

| Type | Host | Value | Priorité |
|---|---|---|---|
| TXT (SPF) | `send` | `v=spf1 include:amazonses.com ~all` | — |
| MX (rebonds) | `send` | `feedback-smtp.<region>.amazonses.com` | `10` |
| TXT (DKIM) | `resend._domainkey` | *(clé `p=…` de Resend)* | — |

**🔑 Piège Namecheap — champ Host** : n'entrer que le sous-domaine, pas le domaine complet.

| Le fournisseur affiche | Dans Namecheap **Host** |
|---|---|
| `debout-stoll.com` | `@` |
| `www.debout-stoll.com` | `www` |
| `send.debout-stoll.com` | `send` |
| `resend._domainkey.debout-stoll.com` | `resend._domainkey` |

---

## 5. Vérification (après propagation ~10–60 min)
```bash
dig +short debout-stoll.com A                       # → IP Vercel
dig +short www.debout-stoll.com CNAME               # → cname.vercel-dns.com
curl -sI https://debout-stoll.com | grep -i strict-transport   # HSTS présent
curl -s  https://debout-stoll.com/api/health        # {"status":"ok","backend":"supabase"}
```

- [ ] Vercel → Domains affiche **Valid Configuration** + HTTPS (cadenas) actif.
- [ ] Resend → Domains affiche **Verified**.
- [ ] `https://debout-stoll.com` charge et redirige `/` → `/fr` ; `/en` OK.
- [ ] `/api/health` renvoie `backend: "supabase"` (⇒ base bien branchée).
- [ ] **Responsive** : tester sur mobile réel (portrait/paysage), tablette, desktop.
- [ ] Adhésion : enregistrement en base + email de confirmation reçu + notif à `EMAIL_NOTIFY`.
- [ ] Compteur d'adhésions augmente (`/api/stats`).
- [ ] Contribution : upload accepté, statut `pending` en base, notification reçue.
- [ ] Aperçu **Open Graph** correct (test WhatsApp/Facebook/LinkedIn).
- [ ] `sitemap.xml` et `robots.txt` accessibles et en `.com`.
- [ ] **Lighthouse ≥ 90** (Performance / SEO / Accessibilité / PWA), hors data-light.

---

## Exploitation courante
- **Modifier le contenu** → éditer `content/*.ts` ou `messages/{fr,en}.json` →
  `git commit` → `git push` → redéploiement automatique.
- **Rollback** → Vercel → *Deployments* → un déploiement précédent → *Promote to Production*.
- **Rotation d'un secret** → changer la valeur dans Vercel → *Environment Variables* → **Redeploy**.
- **Superviser** → brancher UptimeRobot / Better Stack sur `https://debout-stoll.com/api/health`.

Détails complets, Docker/auto-hébergement et modération : **`DEPLOIEMENT.md`**.
