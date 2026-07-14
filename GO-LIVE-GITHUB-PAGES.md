# GO-LIVE — Debout, Stoll ! on GitHub Pages + Namecheap + Facebook

The site deploys as a **static export** to **GitHub Pages** (free, global CDN,
automatic HTTPS), on your Namecheap domain **debout-stoll.com**. There are **no
forms and no database** — all participation happens in the **Facebook group**.

| Piece | How it works now |
|---|---|
| Site (all pages, FR/EN, PWA, animations) | Static HTML on GitHub Pages |
| Membership & participation | **Facebook group** — people join, then post freely |
| Contributions (photos, memories) | Posted directly in the **Facebook group** by members |
| Member counter | A number kept by hand in `content/social.ts` (from the group) |

> This supersedes the Vercel/Zoho/Supabase guides (`GO-LIVE.md`, `DEPLOIEMENT.md`,
> `WALKTHROUGH-*.md`) — kept for reference only.

---

## 1. The Facebook group (the whole participation model)

No forms, no accounts to create. The group already exists and its link is wired
into the site everywhere (the "Join the Facebook group" button).

1. **Group link** — set in `content/social.ts`:
   ```ts
   facebookGroup: 'https://www.facebook.com/groups/2246960062720670/'
   ```
   To change it, edit that line → `git commit` + `git push`.
2. **Member count** — the counter shows a hand-set number (hidden while `0`):
   ```ts
   export const facebookMembers = 0;   // ← put the group's real number
   ```
3. **On Facebook**: set the group Public/Private as you wish, enable membership
   questions/approval if desired, and pin a welcome post inviting members to
   share photos and memories.

---

## 2. Enable GitHub Pages

1. Repo must be **public** (free Pages) → **Settings → Pages → Source = "GitHub Actions"**.
2. The workflow `.github/workflows/deploy.yml` builds and publishes on every push
   to `main` (~2 min). It's already live — the site publishes to
   `https://deboutstoll.github.io/debout-stoll/` until the custom domain is attached.
3. Watch the **Actions** tab → the "Deploy to GitHub Pages" run should be green.

---

## 3. Domain — Namecheap DNS for GitHub Pages

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

## 4. Verify

```bash
dig +short debout-stoll.com A          # → the four 185.199.108-111.153
curl -sI https://debout-stoll.com/     # 200/redirect, HTTPS
```
- [ ] `https://debout-stoll.com` loads, redirects to `/fr`, `/en` works.
- [ ] The **"Join the Facebook group"** button opens the right group (home, Rejoindre, Contribuer).
- [ ] Counter shows the member number (if `facebookMembers` > 0 in `content/social.ts`).
- [ ] Test on a real phone (responsive), check the PWA installs.
- [ ] `sitemap.xml` / `robots.txt` reachable.

---

## Day-to-day
- **Edit content / the Facebook link / member count** → change files (`content/social.ts`, `messages/*.json`) → `git push` → auto-redeploys (~1–2 min).
- **Rollback** → GitHub → Actions → re-run an older successful deploy, or revert the commit.
- **Local preview of the static build** → `npm run build && npm run preview`.
