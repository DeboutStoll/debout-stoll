# Vercel deployment — screen-by-screen walkthrough

A guided, click-by-click walkthrough of deploying `DeboutStoll/debout-stoll` to
Vercel and attaching `debout-stoll.com`. The boxes below are **mockups** of each
Vercel screen (not captured images) — they show what you'll see and exactly
what to click. Companion to `GO-LIVE.en.md`.

Prerequisite: you already have the Supabase URL + service_role key and the
Resend `re_…` key ready (steps 1–2 of `GO-LIVE.en.md`).

---

## Step 1 — Sign in with GitHub

Go to **https://vercel.com** → **Sign Up** / **Log In** → **Continue with GitHub**.
Authorize Vercel for the **DeboutStoll** account.

```
┌───────────────────────────────────────────────┐
│                  ▲ Vercel                      │
│                                                │
│      ┌─────────────────────────────────┐       │
│      │   Continue with GitHub      →   │  ◀ click
│      └─────────────────────────────────┘       │
│      ┌─────────────────────────────────┐       │
│      │   Continue with GitLab          │       │
│      └─────────────────────────────────┘       │
└───────────────────────────────────────────────┘
```

---

## Step 2 — Add New → Project

On the dashboard, top-right: **Add New… ▾** → **Project**.

```
┌──────────────────────────────────────── Vercel ──────────┐
│  Overview   Integrations   Activity        [ Add New… ▾ ] │ ◀ click
│                                             ├ Project      │ ◀ then this
│  Your Projects                              ├ Domain       │
│  (none yet)                                 └ Store        │
└──────────────────────────────────────────────────────────┘
```

---

## Step 3 — Import the repository

Find **`DeboutStoll/debout-stoll`** in the "Import Git Repository" list → **Import**.

```
┌──────────────── Import Git Repository ───────────────────┐
│  GitHub  ▾   DeboutStoll                    [Search…]     │
│                                                          │
│   🔒 DeboutStoll/debout-stoll        [  Import  ]  ◀ click│
│   ○  DeboutStoll/other-repo          [  Import  ]         │
└──────────────────────────────────────────────────────────┘
```

**Don't see the repo?** It's private, so Vercel needs permission:
→ click **"Adjust GitHub App Permissions"** (or **Configure GitHub App**) →
in GitHub, grant Vercel access to **All repositories** or specifically
**debout-stoll** → **Save** → return to Vercel and refresh the list.

---

## Step 4 — Configure Project

This is the important screen. Set **Root Directory**, leave the rest as detected.

```
┌──────────────── Configure Project ───────────────────────┐
│  Project Name    debout-stoll                            │
│                                                          │
│  Framework Preset   [ Next.js            ▾ ]  ✅ auto     │
│                                                          │
│  Root Directory     [ ./               ] [ Edit ] ◀ click│
│      └─ set to:  sos-stoll                                │
│                                                          │
│  ▸ Build and Output Settings   (leave defaults)          │
│  ▾ Environment Variables       (expand — Step 5)         │
│                                                          │
│                                   [   Deploy   ]         │
└──────────────────────────────────────────────────────────┘
```

- **Framework Preset** → should already say **Next.js**. If not, pick it.
- **Root Directory** → click **Edit** → choose/type **`sos-stoll`**.
  ⚠️ This is essential: the app lives in the `sos-stoll/` subfolder, not the repo root.
  (If your repo root *is* the app, leave `./` — but for this repo it's `sos-stoll`.)
- **Build & Output Settings** → leave everything default (Build `next build`,
  Install `npm install`). Do **not** override.

---

## Step 5 — Environment Variables (before first Deploy)

Expand **Environment Variables**. The fastest way: click the **Key** field and
**paste the whole block** — Vercel splits it into rows automatically. Then fill
the empty values.

```
┌──────────── Environment Variables ───────────────────────┐
│  Key                          Value                      │
│  ┌──────────────────────────┐ ┌───────────────────────┐  │
│  │ (paste block here) ────── │ │ …                     │  │ ◀ paste
│  └──────────────────────────┘ └───────────────────────┘  │
│                                                          │
│  Environments:  ☑ Production   ☑ Preview   ☐ Development  │
│                                          [  Add  ]        │
└──────────────────────────────────────────────────────────┘
```

Paste this, then fill the blanks:

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

- Tick **Production** *and* **Preview** so preview deploys also work.
- `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are secrets — only ever here.
- You can also add these later in **Settings → Environment Variables**, but then
  you must **Redeploy** for them to take effect.

---

## Step 6 — Deploy

Click **Deploy**. Watch the build logs (~1–2 min). You want to see the static
pages being generated and a green success.

```
┌──────────────────── Building… ───────────────────────────┐
│  ✓ Cloning DeboutStoll/debout-stoll                      │
│  ✓ Installing dependencies                               │
│  ✓ Running "next build"                                  │
│      ✓ Generating static pages (14/14)                   │
│  ✓ Deployment completed                                  │
│                                                          │
│         🎉  Congratulations!                             │
│         [  Continue to Dashboard  ]   [  Visit  ] ◀ test  │
└──────────────────────────────────────────────────────────┘
```

Click **Visit** → you land on the `…vercel.app` URL. Confirm the site loads and
redirects `/` → `/fr`. Quick check in a new tab:
`https://<your-project>.vercel.app/api/health` → `{"status":"ok","backend":"supabase"}`.
(`backend: "supabase"` means your DB env vars are correct.)

---

## Step 7 — Add the custom domain

Project → **Settings** (top tab) → **Domains** (left menu) → type
`debout-stoll.com` → **Add**. When asked, choose to also add / redirect
`www.debout-stoll.com`.

```
┌──────── Settings ▸ Domains ──────────────────────────────┐
│  Add Domain                                              │
│  [ debout-stoll.com                    ]  [   Add   ] ◀   │
│                                                          │
│  Recommended: add www.debout-stoll.com and redirect      │
│  it to debout-stoll.com.   [ Add ]                       │
└──────────────────────────────────────────────────────────┘
```

---

## Step 8 — Read the DNS values Vercel gives you

Vercel now shows the exact records to create. It looks like this:

```
┌──────── debout-stoll.com — Invalid Configuration ────────┐
│  Set the following records on your DNS provider          │
│  (Namecheap):                                            │
│                                                          │
│   Type   Name   Value                                    │
│   A      @      76.76.21.21                              │
│   CNAME  www    cname.vercel-dns.com                     │
│                                                          │
│  ⟳ Refresh    (status updates automatically)             │
└──────────────────────────────────────────────────────────┘
```

➡️ Take these values to **Namecheap → Advanced DNS** and add them exactly as in
`GO-LIVE.en.md` step 4 (remember the Namecheap Host-field rule: `@` for apex,
`www` for www). **Use the exact value Vercel shows** if the apex IP differs from
`76.76.21.21`.

---

## Step 9 — Wait for green + automatic HTTPS

After DNS propagates (~10–60 min), the same screen flips to:

```
┌──────── debout-stoll.com ─────────────── ✅ Valid ───────┐
│  ✅ Valid Configuration                                  │
│  🔒 SSL Certificate — Issued (auto, Let's Encrypt)       │
│                                                          │
│  www.debout-stoll.com → redirects to debout-stoll.com ✅ │
└──────────────────────────────────────────────────────────┘
```

Vercel issues the HTTPS certificate automatically — no action needed. Click
**⟳ Refresh** if it's slow to update.

---

## Step 10 — Final checks on the real domain

```bash
curl -sI https://debout-stoll.com | grep -i strict-transport   # HSTS present
curl -s  https://debout-stoll.com/api/health                   # backend: "supabase"
```

Open **https://debout-stoll.com** → padlock shown, redirects to `/fr`, `/en`
works, submit a test membership. Then run the full checklist in
`GO-LIVE.en.md` step 5. 🎉 You're live worldwide.

---

## Redeploys & rollback (later)

- **Every `git push` to `main` auto-deploys.** No manual step.
- **Change an env var** → Settings → Environment Variables → edit → then
  **Deployments → ⋯ → Redeploy** (env changes need a fresh build).
- **Rollback** → **Deployments** → pick a previous green deployment → **⋯ →
  Promote to Production** (instant, no rebuild).
- **Preview URLs** → every branch / pull request gets its own preview deployment
  before it reaches production.
