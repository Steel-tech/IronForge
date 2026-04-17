# Migration Plan — localStorage → Neon + Stripe

> **Objective:** convert IronForge from a no-auth, localStorage-only MVP
> into a monetizable, multi-tenant SaaS backed by Neon (serverless
> Postgres) and Stripe (billing, subscriptions, founding-member lifetime
> SKU), without breaking any existing user's saved progress.
>
> **Constraints:**
> - Do not lose a single existing user's localStorage data. Offer a
>   one-click "claim your account" flow that migrates their local state
>   server-side on first login.
> - Keep the product usable in anonymous / free mode. Auth + payment are
>   gates on *persistence across devices* and *premium features*, not on
>   using the wizard itself. This protects the top-of-funnel organic pull.
> - No big-bang rewrite. Ship in 6 incremental phases, each shippable on
>   its own.
>
> **Stack decisions:**
> - **Database:** Neon Postgres (serverless, branching, cheap at idle,
>   plays well with Vercel).
> - **ORM:** Drizzle (TypeScript-native, zero-runtime, matches the repo's
>   strict-mode TS posture).
> - **Auth:** Auth.js v5 (NextAuth) with email magic links + Google OAuth.
>   Small, serverless, no vendor lock.
> - **Payments:** Stripe Checkout + Customer Portal + webhooks. Two
>   products: `founding_lifetime` ($299 one-time) and `pro_monthly` ($49).
> - **Runtime:** Vercel Edge for reads, Node runtime for Stripe webhooks
>   and the migration endpoint (Neon pooled connection).
>
> **Total estimated effort:** 4–6 weeks for a solo founder, 2–3 weeks
> with one collaborator. Ship paid in week 3 via the founding-member
> wedge; polish in weeks 4–6.

---

## PHASE 0 — PRE-FLIGHT (Day 0, ~4 hours)

### 0.1 Inventory current localStorage surface

Every key, every schema, every validator. Do not skip — this is the
contract the migration must preserve.

| localStorage key | Shape (from repo) | Owner module |
|---|---|---|
| `ironforge_user_state` | `UserState` (profile + currentPhase + currentStep + progress map) | `lib/store/user-profile.ts` |
| `ironforge_chat_history` | `ChatState` = `Record<"phase:step", ChatMessage[]>` | `lib/store/chat-history.ts` |
| `ironforge-achievements` | `AchievementsState` (unlocked, visits, sessions, timestamps, usedEstimator) | `lib/store/achievements.ts` |
| `ironforge-calendar` | `CalendarState` (startDate, completedEventIds) | `lib/store/calendar.ts` |
| `ironforge-cap-statement` | `CapStatementData` | `lib/store/cap-statement.ts` |
| `ironforge-nudges` | `NudgeStoreState` (dismissedIds, lastVisitISO, dailyCompletions) | `lib/store/nudges.ts` |
| `ironforge-vault` | `VaultState` (version, documents[]) | `lib/store/vault.ts` |

### 0.2 Set up Neon + environment

1. `neon projects create ironforge-prod` (main branch) + `ironforge-dev`
   branch off main for local.
2. Connection strings into `.env.local` / Vercel:
   - `DATABASE_URL` (pooled, for app runtime)
   - `DATABASE_URL_UNPOOLED` (direct, for migrations)
3. `npm i drizzle-orm @neondatabase/serverless`
4. `npm i -D drizzle-kit`
5. Create `drizzle.config.ts` pointing at `DATABASE_URL_UNPOOLED`.

### 0.3 Set up Stripe

1. Create two products in Stripe:
   - **Founding Lifetime** — $299 one-time, metadata
     `tier=founding_lifetime`, limited quantity 500.
   - **IronForge Pro** — $49/mo recurring, metadata `tier=pro_monthly`.
2. Enable Stripe Customer Portal with cancel + update-payment-method.
3. Generate webhook signing secret → `STRIPE_WEBHOOK_SECRET`.
4. Publishable + secret keys → `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`.

### 0.4 Feature flags

Add `NEXT_PUBLIC_PERSISTENCE_MODE` with values `local` | `hybrid` | `server`.
Every phase below can be toggled via this flag so rollbacks are trivial.

---

## PHASE 1 — DATABASE SCHEMA (Day 1–2)

### 1.1 Drizzle schema (`lib/db/schema.ts`)

```ts
import { pgTable, text, timestamp, jsonb, integer, boolean, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";

// --- Identity ---
export const users = pgTable("users", {
  id: text("id").primaryKey(),                       // cuid or Auth.js user.id
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified"),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Stripe linkage
  stripeCustomerId: text("stripe_customer_id"),
  // Entitlement (denormalized for fast reads; also a source of truth in subscriptions table)
  tier: text("tier").notNull().default("free"),      // free | pro_monthly | founding_lifetime
  tierValidUntil: timestamp("tier_valid_until"),     // null for lifetime
});

// --- Auth.js tables (accounts, sessions, verification_tokens) — use the Auth.js Drizzle adapter preset ---

// --- Waitlist (landing page) ---
export const waitlist = pgTable("waitlist", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  seatNumber: integer("seat_number").notNull(),
  source: text("source"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  invitedAt: timestamp("invited_at"),
  convertedUserId: text("converted_user_id"),
});

// --- User profile & navigation (replaces `ironforge_user_state`) ---
export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  stateCode: text("state_code"),                     // 2-letter, nullable
  isVeteran: boolean("is_veteran").notNull().default(false),
  isDisabledVeteran: boolean("is_disabled_veteran").notNull().default(false),
  isMinority: boolean("is_minority").notNull().default(false),
  isWomanOwned: boolean("is_woman_owned").notNull().default(false),
  businessName: text("business_name").notNull().default(""),
  tradeExperience: text("trade_experience").notNull().default(""),
  currentPhase: text("current_phase").notNull().default("business-formation"),
  currentStep: text("current_step").notNull().default("llc-structure"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Wizard progress (per-step) ---
export const stepProgress = pgTable("step_progress", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  phaseId: text("phase_id").notNull(),
  stepId: text("step_id").notNull(),
  visited: boolean("visited").notNull().default(false),
  completedChecklist: jsonb("completed_checklist").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.phaseId, t.stepId] }),
}));

// --- Chat history (per phase:step thread) ---
export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  threadKey: text("thread_key").notNull(),          // "phase-id:step-id"
  role: text("role").notNull(),                      // 'user' | 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  byUserThread: uniqueIndex("chat_user_thread_idx").on(t.userId, t.threadKey, t.createdAt),
}));

// --- Achievements, calendar, cap-statement, nudges, vault ---
// Option A (fast): a single key/value JSON blob per user per feature.
// Option B (proper): relational tables. Recommend A for phase 1, B for phase 5.
export const userStores = pgTable("user_stores", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  storeKey: text("store_key").notNull(),             // 'achievements' | 'calendar' | 'cap-statement' | 'nudges' | 'vault'
  data: jsonb("data").notNull(),
  version: integer("version").notNull().default(1),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.storeKey] }),
}));

// --- Subscriptions (Stripe source of truth mirror) ---
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),                       // Stripe subscription id or checkout id
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  product: text("product").notNull(),                // founding_lifetime | pro_monthly
  status: text("status").notNull(),                  // active | canceled | past_due | paused | trialing
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Billing events audit log ---
export const billingEvents = pgTable("billing_events", {
  id: text("id").primaryKey(),                       // Stripe event id
  type: text("type").notNull(),
  userId: text("user_id"),
  payload: jsonb("payload").notNull(),
  processedAt: timestamp("processed_at").notNull().defaultNow(),
});
```

### 1.2 Generate + apply migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 1.3 Seed script

`scripts/seed.ts` — creates a test user, populates dummy progress, useful
for local development against Neon dev branch.

---

## PHASE 2 — AUTH (Day 3–5)

### 2.1 Auth.js v5 wired to Neon

- Add `auth.ts` at project root with the Drizzle adapter.
- Providers: **Email (magic link via Resend)** + **Google OAuth**.
- Session strategy: `database` (sessions table in Neon), not JWT — makes
  instant revoke possible.
- Add `middleware.ts` protecting `/app/*` authenticated routes. Wizard
  itself stays public (`/wizard/*`) for the free/anonymous flow.

### 2.2 New routes

| Route | Purpose |
|---|---|
| `/signin` | Email + Google |
| `/claim` | Post-login: migrate localStorage → server (see Phase 3) |
| `/account` | Profile, billing, data export, delete account |
| `/api/auth/*` | Auth.js handlers |

### 2.3 Environment

```
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_RESEND_KEY=...
AUTH_URL=https://ironforge.app
```

---

## PHASE 3 — HYBRID PERSISTENCE + ONE-CLICK MIGRATION (Day 6–9)

This is the trickiest phase. The goal is: **existing anonymous users keep
using the app exactly as before, but the moment they sign in, we migrate
their localStorage data to Neon and switch reads/writes to server.**

### 3.1 Introduce a persistence abstraction

Create `lib/store/persistence.ts` — a thin facade over all 7 stores:

```ts
export interface Persistence {
  loadUserState(): Promise<UserState>;
  saveUserState(s: UserState): Promise<void>;
  loadChatHistory(): Promise<ChatState>;
  saveChatHistory(s: ChatState): Promise<void>;
  // ...one method pair per store
}

// Two implementations:
// - LocalPersistence (wraps existing localStorage code, unchanged)
// - ServerPersistence (calls /api/state/* endpoints)
// - HybridPersistence (read from local first, write-through to server when authenticated)
```

Refactor each of the existing `lib/store/*.ts` modules to route through
this facade. **No component code changes.** Components still call
`loadUserState()`; the facade decides where it goes.

### 3.2 Server API routes

| Route | Verb | Purpose |
|---|---|---|
| `/api/state/profile` | GET/PUT | user_profiles row |
| `/api/state/progress` | GET/PUT | step_progress rows (bulk) |
| `/api/state/chat/[threadKey]` | GET/POST | chat_messages scoped to thread |
| `/api/state/store/[storeKey]` | GET/PUT | user_stores JSON blob (achievements, calendar, cap-statement, nudges, vault) |
| `/api/state/migrate` | POST | one-shot localStorage bulk import |
| `/api/state/export` | GET | full JSON data export (GDPR) |
| `/api/state/delete` | DELETE | wipe user data (GDPR) |

All routes server-auth-guarded via Auth.js session. Rate-limited via
`@upstash/ratelimit` or equivalent (20 req/10s per user).

### 3.3 `/claim` flow — the UX that matters

On first sign-in the landing redirect goes to `/claim`:

1. Detect presence of any `ironforge*` localStorage keys.
2. Show a branded confirmation: "Claim your 47% progress and 23 chat
   messages? We'll move them to your new account."
3. POST `/api/state/migrate` with a single payload combining all 7
   stores. Server validates each payload with the existing `isValidX`
   validators (copy them from `lib/store/*.ts` to shared `lib/validation/`).
4. On success: `localStorage.setItem("ironforge_migrated_at", ISO)` and
   flip the facade to ServerPersistence. Keep the old keys for 30 days
   as a rollback safety net (read-only fallback).
5. On failure: show the raw JSON and a "download my data" button so the
   user never loses work. Log the error server-side with a scrubbed
   payload for debugging.

### 3.4 Conflict policy

If the user already has a server-side profile (e.g. signed in on another
device first), do NOT blindly overwrite. Show a three-option dialog:
**(a) keep server data**, **(b) use local data**, **(c) merge** (server
wins for numbers, local wins for text fields, chat histories concatenate
deduped by `id`). Default: keep server.

### 3.5 Feature flag rollout

- Week 1: `PERSISTENCE_MODE=local` (no change in behavior).
- Week 2: `PERSISTENCE_MODE=hybrid` for 10% of sessions.
- Week 3: 100% hybrid once error rates < 0.1%.

---

## PHASE 4 — STRIPE + ENTITLEMENTS (Day 10–14)

### 4.1 Checkout endpoints

| Route | Purpose |
|---|---|
| `/api/billing/checkout` | POST `{product: 'founding_lifetime' \| 'pro_monthly'}` → returns Checkout Session URL |
| `/api/billing/portal` | POST → returns Stripe Customer Portal URL |
| `/api/billing/webhook` | POST → handles Stripe webhook events |

### 4.2 Webhook handler (Node runtime, raw body)

Handled events:
- `checkout.session.completed` → create/update `subscriptions` row,
  set `users.tier` to `founding_lifetime` (lifetime) or `pro_monthly`,
  set `users.tierValidUntil`.
- `customer.subscription.updated` → mirror status + period_end.
- `customer.subscription.deleted` → set `users.tier = 'free'` at period
  end (respect `cancel_at_period_end`).
- `invoice.payment_failed` → mark `past_due`, send dunning email.
- Every event recorded idempotently in `billing_events` (primary key =
  Stripe event id, insert-if-not-exists).

**Signature verification is mandatory.** Use `stripe.webhooks.constructEvent`
with the raw body; ensure Next.js route uses `runtime = "nodejs"` and the
App Router `POST` handler reads `await req.text()` instead of `.json()`.

### 4.3 Entitlement check

Single helper: `hasEntitlement(user, feature)` in `lib/auth/entitlements.ts`.

| Feature | Free | Pro / Founding |
|---|---|---|
| Wizard (all 50 states) | ✅ read-only | ✅ |
| AI mentor (Claude) | 10 messages/mo | unlimited |
| Cross-device sync | ❌ | ✅ |
| Capability statement PDF export | ❌ | ✅ |
| Vault (document storage) | ❌ | ✅ |
| Calendar + nudges | ✅ basic | ✅ full |
| State data change-feed | ❌ | ✅ |
| Priority AI response queue | ❌ | Founding only |

Free users can use the whole wizard — they just can't sync across
devices, can't export PDFs, and hit an AI rate limit after 10 msgs.
This preserves the organic top-of-funnel.

### 4.4 Founding-member seat counter

- `waitlist.seat_number` is monotonic.
- Track active founding_lifetime subscriptions count.
- When count hits 500, hide the Founding Checkout button automatically
  and show "Founding seats sold out — get Pro at $49/mo."

### 4.5 Testing

- Stripe CLI: `stripe listen --forward-to localhost:3000/api/billing/webhook`.
- Test every event type + a signature-mismatch case + a replay (verify
  idempotency).

---

## PHASE 5 — HARDEN & OBSERVABILITY (Day 15–18)

### 5.1 Convert JSON blob stores to relational tables

For achievements, calendar, and vault — the three stores likely to be
queried analytically. Migrate `user_stores` rows to proper tables with a
one-off backfill script. Chat messages are already relational. Keep
cap-statement and nudges as JSON (they're document-shaped by nature).

### 5.2 Observability

- **Logging:** `pino` with Vercel OTel. Every API route logs `userId`,
  `route`, `latency`, `status`.
- **Errors:** Sentry with source maps. Tag billing errors with
  `stripe.event.id` for one-click cross-reference.
- **Metrics to dashboard:** MAU, paid conversion, founding seats sold,
  AI messages/user/day, migration success rate, webhook error rate,
  Neon connection pool saturation.

### 5.3 Rate limits + abuse

- `/api/chat` — 60 req/hr for free, 600 for pro.
- `/api/state/migrate` — 1 req/24h per user.
- `/api/billing/*` — 10 req/min per IP.

### 5.4 GDPR/CCPA

- `/account/export` generates a JSON archive of all 7 stores + billing
  history.
- `/account/delete` hard-deletes user + cascades; keeps billing_events
  for legal retention (7 years).
- Privacy policy + cookie banner updated before paid launch.

### 5.5 Backups

- Neon point-in-time recovery is automatic — verify retention window is
  ≥ 7 days.
- Weekly `pg_dump` to S3 via a cron job on Vercel / GitHub Actions.
- Monthly restore drill into a Neon branch to prove the backups work.

---

## PHASE 6 — LAUNCH (Day 19–21)

### 6.1 Pre-launch checklist

- [ ] All Stripe products live + tested in production mode with a $1 card.
- [ ] Webhook endpoint registered in Stripe dashboard + verified
      (`stripe events resend` test).
- [ ] Founding-member counter visible and accurate.
- [ ] `/claim` flow tested with at least 3 real existing localStorage
      snapshots.
- [ ] "Not legal advice" + "last verified" timestamps live on all state
      pages (regulatory liability posture).
- [ ] E&O insurance bound ($100/mo ballpark).
- [ ] Privacy policy + ToS + refund policy published and linked in
      checkout.
- [ ] AGPL + Commercial license wording rendered in /licensing page.
- [ ] Uptime monitoring (Better Stack / Upptime) on `/`, `/api/chat`,
      `/api/billing/webhook`.

### 6.2 Launch sequence

1. **Soft launch (day 19):** enable checkout for waitlist cohort #1 only
   (first 100 emails). Email subject: "Your founding seat is live —
   $299 locked forever, 7 days only." Measure conversion.
2. **Public launch (day 21):** open to entire waitlist, publish Reddit +
   Facebook group posts, fire the cold-email sequence to district councils.
3. **Week 2 post-launch:** founder posts daily metrics publicly on X /
   LinkedIn (seats sold, users onboarded, bugs fixed). This is PR.

### 6.3 Rollback plan

Every phase is behind a feature flag. If webhook errors spike > 1%:
flip `PERSISTENCE_MODE` back to `local` + disable checkout. No user data
is lost because localStorage is still the source of truth for anonymous
sessions and the 30-day rollback window for claimed sessions.

---

## RISK LOG

| Risk | Likelihood | Mitigation |
|---|---|---|
| localStorage migration loses data for a user | Low | 30-day local retention + downloadable JSON on any migration failure + validator coverage |
| Stripe webhook race condition sets wrong tier | Medium | Idempotent processing keyed on Stripe event id; entitlement always derived from `subscriptions` table, never from webhook alone |
| Neon pool exhaustion during launch spike | Medium | Use pooled connection string; Vercel Edge for read-heavy endpoints; load-test at 10× expected peak |
| AI rate-limit circumvention via multiple free accounts | Medium | Email verification + device fingerprint; soft limit server-side on `/api/chat` by user + IP |
| A SaaS competitor forks the repo | Mitigated by license | AGPL-3.0 + Commercial dual license makes closed-source hosted forks a copyright violation |
| Regulatory dataset drift during migration | Low | Phase doesn't touch content files; `state-registry.ts` remains file-based until a separate CMS epic |

---

## OUT OF SCOPE FOR THIS MIGRATION

- Admin CMS for state registry (track as a separate epic — phase 7).
- Mobile native app.
- Third-trade vertical (electrical). Requires content pipeline work.
- SSO / SAML for district council enterprise customers. Bolt on after
  first signed council contract.
- SOC 2 Type II. Start SOC 2 Type I self-assessment after $500k ARR.

---

## DELIVERABLE SUMMARY

End state:

- Anonymous users can still use IronForge exactly as before.
- Signed-in users have cross-device sync, persistent chat, and paid
  features behind a single entitlement check.
- $299 founding-lifetime SKU live with a seat counter.
- $49/mo pro SKU live with Customer Portal.
- Clean separation between free (funnel) and paid (retention) features.
- Observable, rate-limited, refund-able, legally bounded.

**This is the minimum viable commercialization surface.** Everything
after — PDF exports, vault OCR, mobile, district-council SSO, trade #2
— rides on top of this foundation.
