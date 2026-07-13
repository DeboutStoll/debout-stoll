# Supabase & Resend — account-setup walkthrough

Screen-by-screen setup of the two backend services, in the same style as
`WALKTHROUGH-VERCEL.md`. The boxes are **mockups** of each screen (not captured
images) — they show what you'll see and what to click. At the end you'll have
the 3 secrets Vercel needs:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

Do **Supabase (Part A)** first, then **Resend (Part B)**.

═══════════════════════════════════════════════════════════════════════════════
# Part A — Supabase (database)
═══════════════════════════════════════════════════════════════════════════════

## A1 — Create an account & organization

Go to **https://supabase.com** → **Start your project** → **Continue with GitHub**.
First time: Supabase asks you to create an **Organization** (a billing container).

```
┌──────────────── Create a new organization ───────────────┐
│  Name         Debout Stoll                               │
│  Type         Personal            ▾                      │
│  Plan         ○ Free   ● Free (selected)   ○ Pro         │
│                                        [  Create org  ]  │
└──────────────────────────────────────────────────────────┘
```
The **Free** plan is plenty to launch (500 MB DB, 1 GB storage, 50k monthly
active users). You can upgrade later without migrating.

---

## A2 — Create the project

**New project** → fill in:

```
┌──────────────────── New Project ─────────────────────────┐
│  Organization    Debout Stoll            ▾               │
│  Project name    debout-stoll                            │
│                                                          │
│  Database Password  [ ••••••••••••••• ]  [ Generate ] ◀  │
│     └─ click Generate, then COPY & SAVE it somewhere safe│
│                                                          │
│  Region   [ West EU (Ireland)          ▾ ] ◀ pick Europe │
│                                                          │
│                                   [  Create new project ]│
└──────────────────────────────────────────────────────────┘
```
- **Region** → choose **West EU (Ireland)** or **Frankfurt** — best latency
  Cameroon ↔ Europe. You cannot change region later, so pick now.
- **Database Password** → click Generate, **save it** in your password manager.
  (You won't need it for the app — the app uses the API keys — but you'll want it
  for direct DB access.)
- Click **Create new project** and wait ~2 min while it provisions.

---

## A3 — Run the schema (creates tables, indexes, RLS, storage bucket)

Left sidebar → **SQL Editor** → **+ New query** → paste **all of
`supabase/schema.sql`** from the repo → **Run** (or Ctrl/Cmd+Enter).

```
┌──────────────── SQL Editor ──────────────────────────────┐
│  [ + New query ]                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ -- paste the entire contents of                   │   │
│  │ -- supabase/schema.sql here                        │   │
│  │ create extension if not exists pgcrypto;           │   │
│  │ create table if not exists public.members ( … );   │   │
│  │ …                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                    [  Run  ▶ ] ◀ click    │
│  ✅ Success. No rows returned                            │
└──────────────────────────────────────────────────────────┘
```
Expected result: **"Success. No rows returned."** (It's idempotent — safe to run
again if you're unsure.)

**Verify it worked** — sidebar → **Table Editor** → you should now see two
tables: **`members`** and **`contributions`**. And **Storage** → a private
bucket **`contributions`**.

```
┌──────── Table Editor ────────┐   ┌──────── Storage ─────────┐
│  Tables                      │   │  Buckets                 │
│   • members                  │   │   🔒 contributions       │
│   • contributions            │   │      (private)           │
└──────────────────────────────┘   └──────────────────────────┘
```

---

## A4 — Copy the two API secrets

Sidebar → **Project Settings** (gear) → **API**.

```
┌──────── Project Settings ▸ API ──────────────────────────┐
│  Project URL                                             │
│   https://abcdefghijklmno.supabase.co        [ Copy ] ◀  │  → SUPABASE_URL
│                                                          │
│  Project API keys                                        │
│   anon        public     eyJhbGci…            [ Copy ]   │  ✗ NOT this one
│   service_role secret 🔑  eyJhbGci…  [Reveal][ Copy ] ◀  │  → SUPABASE_SERVICE_ROLE_KEY
│      ⚠ This key bypasses Row Level Security. Keep secret.│
└──────────────────────────────────────────────────────────┘
```
- **Project URL** → this is `SUPABASE_URL`.
- **`service_role` key** (click **Reveal**, then **Copy**) → this is
  `SUPABASE_SERVICE_ROLE_KEY`.
  🔴 **Never** use the `anon`/`public` key for this app, and never expose
  `service_role` in the browser or commit it. It goes **only** into Vercel env vars.

> Newer Supabase dashboards label these under **API Keys** as a "secret" key —
> use the **secret / service_role** one, not the "publishable/anon" one.

Paste both into Vercel (`GO-LIVE.en.md` step 3). ✅ Supabase done.

═══════════════════════════════════════════════════════════════════════════════
# Part B — Resend (transactional email)
═══════════════════════════════════════════════════════════════════════════════

## B1 — Create an account

Go to **https://resend.com** → **Sign up** (GitHub or email). The Free plan
sends 3,000 emails/month, 100/day — ample for membership confirmations.

---

## B2 — Add & verify the domain

Sidebar → **Domains** → **Add Domain**.

```
┌──────────────── Add Domain ──────────────────────────────┐
│  Domain     [ debout-stoll.com            ]              │
│  Region     [ EU (Ireland)             ▾ ] ◀ match Europe│
│                                        [  Add  ] ◀ click │
└──────────────────────────────────────────────────────────┘
```
Resend then shows the **DNS records** you must add at Namecheap:

```
┌──── debout-stoll.com — Not verified ─────────────────────┐
│  Add these records to your DNS provider:                 │
│                                                          │
│  Type   Name/Host              Value              Prio   │
│  MX     send                   feedback-smtp.eu-…  10    │
│  TXT    send                   v=spf1 include:ama… —     │
│  TXT    resend._domainkey      p=MIGfMA0GCSq…      —     │
│                                                          │
│  Status: ⏳ Pending    [ Verify DNS Records ]            │
└──────────────────────────────────────────────────────────┘
```
➡️ Copy these **exact values** into **Namecheap → Advanced DNS**
(`GO-LIVE.en.md` step 4). Remember the Namecheap Host rule — enter only the
subdomain part:

| Resend shows | Namecheap **Host** |
|---|---|
| `send.debout-stoll.com` | `send` |
| `resend._domainkey.debout-stoll.com` | `resend._domainkey` |

After adding them, come back and click **Verify DNS Records**. Propagation can
take 10–60 min; the status flips to **Verified** ✅ (green) when ready.

```
┌──── debout-stoll.com ───────────────────── ✅ Verified ──┐
│  DKIM ✅   SPF ✅   MX ✅                                 │
│  You can now send from @debout-stoll.com                 │
└──────────────────────────────────────────────────────────┘
```
> Sending works only **after** the domain is Verified. Until then, join/contribute
> still succeed (records save to the DB) — the emails just don't send yet.

---

## B3 — Create the API key

Sidebar → **API Keys** → **Create API Key**.

```
┌──────────────── Create API Key ──────────────────────────┐
│  Name          debout-stoll-production                   │
│  Permission    [ Full access        ▾ ]  (or Sending)    │
│  Domain        [ debout-stoll.com    ▾ ]                 │
│                                     [  Add  ] ◀ click     │
└──────────────────────────────────────────────────────────┘
```
Resend shows the key **once**:

```
┌──────────────────────────────────────────────────────────┐
│  ✅ API key created                                       │
│   re_AbC123dEf456GhI789…              [ Copy ] ◀ COPY NOW │
│   ⚠ You won't be able to see it again.                    │
└──────────────────────────────────────────────────────────┘
```
🔴 **Copy it now** — it's shown only once. This is `RESEND_API_KEY`. Paste it
straight into Vercel. If you lose it, just delete and create a new one.

---

## B4 — (Optional) A real inbox for contact@debout-stoll.com

Resend **sends** email; it does not give you an **inbox**. To *receive* mail at
`contact@debout-stoll.com` (e.g. replies to confirmations), set up a mailbox with
a provider and add **its** MX records at Namecheap:

- **Zoho Mail** — free tier, 1 domain. Or
- **Google Workspace** / **Microsoft 365** — paid.

This is optional for go-live — the site works without it. `EMAIL_NOTIFY` can
also point to any existing inbox you already read (e.g. a Gmail address) if you
prefer to receive notifications there instead.

═══════════════════════════════════════════════════════════════════════════════
# You now have the 3 secrets
═══════════════════════════════════════════════════════════════════════════════

| Secret | From | Goes into |
|---|---|---|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL | Vercel env var |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role | Vercel env var |
| `RESEND_API_KEY` | Resend → API Keys → the `re_…` value | Vercel env var |

➡️ Next: enter them in Vercel (`WALKTHROUGH-VERCEL.md` step 5 /
`GO-LIVE.en.md` step 3), then finish DNS and run the verification checklist.
After deploy, `https://debout-stoll.com/api/health` returning
`{"status":"ok","backend":"supabase"}` confirms Supabase is wired correctly.
