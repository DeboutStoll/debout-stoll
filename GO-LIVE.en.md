# GO-LIVE — Debout, Stoll ! → `debout-stoll.com`

Condensed production runbook (English). For full detail and alternatives, see
**`DEPLOIEMENT.md`** (French). Follow the steps **in order** and tick as you go.
Allow ~30–45 min (excluding DNS propagation).

**Stack**: GitHub (`DeboutStoll/debout-stoll`) → Vercel (hosting + global CDN +
HTTPS) → Supabase (database) → Resend (email) → Namecheap (DNS).

---

## ✅ Already done
- [x] GitHub repo created: **https://github.com/DeboutStoll/debout-stoll** (private).
- [x] Code pushed to `main` (production-hardened: `.com` domain, security headers,
      edge caching, `/api/health`).
- [x] `supabase/schema.sql` ready to run.
- [x] `.env.local` template in place (local only, git-ignored).

---

## 0. 🔴 Security — do this first
- [ ] **Revoke** the GitHub token that was shared in plaintext: https://github.com/settings/tokens
- [ ] Create a new **fine-grained token** (scoped to this repo, short expiry).
- [ ] Never paste a secret (`service_role`, Resend key, PAT) into a chat, a
      committed file, or a screenshot. They live only in Vercel env variables.

---

## 1. Database — Supabase
- [ ] **New project** at https://supabase.com (region **Europe / `eu-west`**).
- [ ] **SQL Editor → New query** → paste **all of `supabase/schema.sql`** → *Run*.
      (Idempotent: safe to re-run. Creates tables + indexes + RLS + storage bucket.)
- [ ] **Settings → API**: note the `Project URL` and the **`service_role`** key (secret).
- [ ] Verify: `select count(*) from public.members;` returns `0`.

---

## 2. Email — Resend
- [ ] Account at https://resend.com → **Domains → Add Domain**: `debout-stoll.com`.
- [ ] Note the **SPF / DKIM / MX** records shown (needed for the DNS step 4).
- [ ] **API Keys → Create** → note the `re_…` key (secret).

---

## 3. Hosting — Vercel
- [ ] https://vercel.com → **Add New → Project → Import** `DeboutStoll/debout-stoll`.
- [ ] If asked: **Root Directory = `sos-stoll`**. (Next.js is auto-detected.)
- [ ] **Settings → Environment Variables** → paste the block below and **fill the
      empty values**; tick **Production** *and* **Preview**:

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

| Key | Value | Source | Secret |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://debout-stoll.com` | fixed | no |
| `SUPABASE_URL` | *Project URL* | Supabase → API | no |
| `SUPABASE_SERVICE_ROLE_KEY` | *service_role* | Supabase → API | 🔒 yes |
| `SUPABASE_BUCKET` | `contributions` | fixed | no |
| `MEMBER_BASE_COUNT` | e.g. `250` (0 if none) | you | no |
| `RESEND_API_KEY` | `re_…` | Resend → API Keys | 🔒 yes |
| `EMAIL_FROM` | `Debout Stoll <contact@debout-stoll.com>` | fixed | no |
| `EMAIL_NOTIFY` | `contact@debout-stoll.com` | fixed | no |

- [ ] **Deploy**. Test first on the generated `*.vercel.app` URL.
- [ ] Any variable change ⇒ **Redeploy** (env vars don't apply retroactively to
      an existing build).

> `NEXT_PUBLIC_*` = exposed to the browser (never a secret). The rest stay server-side.
> Optional later: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`
> (anti-spam), `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=debout-stoll.com` (analytics).

---

## 4. Domain — Namecheap DNS
Vercel → **Settings → Domains → Add**: `debout-stoll.com` **and** `www.debout-stoll.com`.
Then Namecheap → **Domain List → Manage → Advanced DNS** (nameservers = *Namecheap BasicDNS*).

**🗑️ Delete** the default parking records:

| Type | Host | Value (typical) |
|---|---|---|
| CNAME Record | `www` | `parkingpage.namecheap.com.` |
| URL Redirect | `@` | `http://www.debout-stoll.com/` |
| A Record *(if present)* | `@` | a Namecheap parking IP |

**➕ Add** (website — Vercel):

| Type | Host | Value | TTL |
|---|---|---|---|
| A Record | `@` | `76.76.21.21` *(or the exact value Vercel shows)* | Automatic |
| CNAME Record | `www` | `cname.vercel-dns.com.` | Automatic |

**➕ Add** (email — Resend, use the **exact** values from the Resend dashboard):

| Type | Host | Value | Priority |
|---|---|---|---|
| TXT (SPF) | `send` | `v=spf1 include:amazonses.com ~all` | — |
| MX (bounces) | `send` | `feedback-smtp.<region>.amazonses.com` | `10` |
| TXT (DKIM) | `resend._domainkey` | *(the `p=…` key from Resend)* | — |

**🔑 Namecheap gotcha — the Host field**: enter only the subdomain, not the full domain.

| Provider shows | Namecheap **Host** |
|---|---|
| `debout-stoll.com` | `@` |
| `www.debout-stoll.com` | `www` |
| `send.debout-stoll.com` | `send` |
| `resend._domainkey.debout-stoll.com` | `resend._domainkey` |

---

## 5. Verification (after propagation ~10–60 min)
```bash
dig +short debout-stoll.com A                       # → Vercel IP
dig +short www.debout-stoll.com CNAME               # → cname.vercel-dns.com
curl -sI https://debout-stoll.com | grep -i strict-transport   # HSTS present
curl -s  https://debout-stoll.com/api/health        # {"status":"ok","backend":"supabase"}
```

- [ ] Vercel → Domains shows **Valid Configuration** + HTTPS (padlock) active.
- [ ] Resend → Domains shows **Verified**.
- [ ] `https://debout-stoll.com` loads and redirects `/` → `/fr`; `/en` works.
- [ ] `/api/health` returns `backend: "supabase"` (⇒ database wired correctly).
- [ ] **Responsive**: test on a real phone (portrait/landscape), tablet, desktop.
- [ ] Membership: record saved to DB + confirmation email received + notification to `EMAIL_NOTIFY`.
- [ ] Member counter increases (`/api/stats`).
- [ ] Contribution: upload accepted, `pending` status in DB, notification received.
- [ ] **Open Graph** preview correct (test on WhatsApp/Facebook/LinkedIn).
- [ ] `sitemap.xml` and `robots.txt` reachable and on `.com`.
- [ ] **Lighthouse ≥ 90** (Performance / SEO / Accessibility / PWA), outside data-light mode.

---

## Day-to-day operations
- **Edit content** → edit `content/*.ts` or `messages/{fr,en}.json` → `git commit`
  → `git push` → automatic redeploy.
- **Rollback** → Vercel → *Deployments* → pick an earlier deployment → *Promote to Production*.
- **Rotate a secret** → change the value in Vercel → *Environment Variables* → **Redeploy**.
- **Monitor** → point UptimeRobot / Better Stack at `https://debout-stoll.com/api/health`.

Full detail, Docker/self-hosting, and moderation flow: **`DEPLOIEMENT.md`**.
