# GO-LIVE — Debout, Stoll ! on GitHub Pages + Namecheap + Zoho

The site now deploys as a **static export** to **GitHub Pages** (free, global
CDN, automatic HTTPS), on your Namecheap domain **debout-stoll.com**. The
dynamic parts are handled without a server:

| Piece | How it works now |
|---|---|
| Site (all pages, FR/EN, PWA, animations) | Static HTML on GitHub Pages |
| Membership form | **Zoho Form** (embedded) → emails `contact@debout-stoll.com` |
| Contribution form (+ photo) | **Zoho Form** (embedded, file upload) → moderated in Zoho |
| Live member counter | **Supabase** read client-side via the public anon key |

> This supersedes the Vercel-based guides (`GO-LIVE.md`, `DEPLOIEMENT.md`,
> `WALKTHROUGH-VERCEL.md`, `WALKTHROUGH-SUPABASE-RESEND.md`) — those describe the
> old server architecture and are kept only for reference.

---

## 1. Create the two Zoho Forms

In **https://www.zoho.com/forms** → create two forms. Match the fields below
(they mirror the app's original forms).

**Form A — "Rejoindre l'appel / Membership"**
| Field | Type | Required |
|---|---|---|
| Nom / Name | Single line | ✅ |
| Promotion | Single line | — |
| Ville / City | Single line | — |
| Email | Email | ✅ |
| Message | Multi line | — |

**Form B — "Contribution mémoire / Memory contribution"**
| Field | Type | Required |
|---|---|---|
| Nom / Name | Single line | ✅ |
| Email | Email | ✅ |
| Type (photo / témoignage / figure) | Dropdown | ✅ |
| Titre / Title | Single line | ✅ |
| Récit / Story | Multi line | — |
| Fichier / File | File upload (jpg/png/webp/pdf) | — |
| Consentement / Consent | Checkbox | ✅ |

For **each** form:
- **Settings → Email Notifications** → send to `contact@debout-stoll.com` on every submission.
- (Optional) **Acknowledgement email** → confirmation to the submitter's email.
- **Share → Embed** → copy the **Permalink / iframe URL** (`https://forms.zohopublic…`).

Then paste the two URLs into **`content/forms.ts`**:
```ts
export const zohoForms = {
  join: 'https://forms.zohopublic.com/…/formperma/…',
  contribute: 'https://forms.zohopublic.com/…/formperma/…',
};
```
Commit + push → the forms appear on the site.

---

## 2. Live counter — Supabase (optional but requested)

1. In your Supabase project → **SQL Editor** → run **`supabase/schema.sql`**
   (once), then **`supabase/member-count.sql`** (exposes a safe count to `anon`).
2. **Settings → API** → copy the **Project URL** and the **anon `public`** key
   (this one is safe to expose — NOT the service_role).
3. GitHub → repo **Settings → Secrets and variables → Actions**:
   - Secret `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - Secret `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the anon public key
   - Variable `NEXT_PUBLIC_MEMBER_BASE_COUNT` = starting offset (e.g. `250`, or `0`)

**Feeding the counter with real sign-ups** — since the form goes to Zoho, choose one:
- **Zoho → Supabase webhook** (Zoho Forms *Integrations → Webhook* → insert a
  row into `members` via Supabase REST). Best: the counter tracks real members.
- **Manual**: bump `NEXT_PUBLIC_MEMBER_BASE_COUNT` periodically from Zoho's
  submission count. Simplest.

If you skip Supabase entirely, the counter just shows the base number.

---

## 3. Enable GitHub Pages

1. Repo **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
2. The workflow `.github/workflows/deploy.yml` builds and publishes on every push
   to `main`. Merge the `github-pages` branch into `main` to trigger the first
   deploy:
   ```bash
   git checkout main && git merge github-pages && git push
   ```
3. Watch **Actions** tab → the "Deploy to GitHub Pages" run should go green.
   Your site is live at `https://deboutstoll.github.io` until the domain is attached.

---

## 4. Domain — Namecheap DNS for GitHub Pages

Repo **Settings → Pages → Custom domain** → enter `debout-stoll.com` → Save.
(The `public/CNAME` file already pins it too.)

Then Namecheap → **Advanced DNS**. **Delete** the parking `CNAME www` and `URL
Redirect @`, then add:

| Type | Host | Value | TTL |
|---|---|---|---|
| A Record | `@` | `185.199.108.153` | Automatic |
| A Record | `@` | `185.199.109.153` | Automatic |
| A Record | `@` | `185.199.110.153` | Automatic |
| A Record | `@` | `185.199.111.153` | Automatic |
| CNAME Record | `www` | `deboutstoll.github.io.` | Automatic |

> Keep your existing **Zoho Mail** records (MX / SPF / DKIM for
> `contact@debout-stoll.com`) untouched — they are unrelated to Pages.

After propagation (10–60 min): repo **Settings → Pages** shows the domain
verified → tick **Enforce HTTPS** (GitHub issues the certificate automatically).

---

## 5. Verify

```bash
dig +short debout-stoll.com A          # → the four 185.199.108-111.153
curl -sI https://debout-stoll.com/     # 200/redirect, HTTPS
```
- [ ] `https://debout-stoll.com` loads, redirects to `/fr`, `/en` works.
- [ ] Both Zoho forms display and submit; email arrives at `contact@debout-stoll.com`.
- [ ] Counter shows a number (base, or live if Supabase is fed).
- [ ] Test on a real phone (responsive), check the PWA installs.
- [ ] `sitemap.xml` / `robots.txt` reachable.

---

## Day-to-day
- **Edit content / forms** → change files → `git push` → auto-redeploys (~1–2 min).
- **Rollback** → GitHub → Actions → re-run an older successful deploy, or revert the commit.
- **Local preview of the static build** → `npm run build && npm run preview`.
