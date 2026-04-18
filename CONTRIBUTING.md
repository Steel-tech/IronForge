# Contributing to IronForge

Thanks for your interest. IronForge is built with and for the ironworking
trade. We welcome contributions from:

- **Ironworkers, contractors, business agents, and apprenticeship
  coordinators** with corrections or updates to state-specific
  regulatory, bond, workers' comp, prevailing wage, or union local data.
- **Engineers** improving the wizard, AI mentor, accessibility,
  performance, or tests.
- **Legal / compliance professionals** helping tighten disclaimers, ToS,
  and jurisdiction-specific guidance.

---

## Before You Start

1. **Open an issue first** for anything non-trivial (new feature,
   refactor, new state/local data). A 5-minute sanity check saves hours
   of rework.
2. **Read the [LICENSE](LICENSE).** IronForge is dual-licensed under
   **AGPL-3.0 + Commercial**. Your contribution will be made available
   under both licenses (see CLA below).
3. **Be respectful.** This is a trade-first community. No gatekeeping,
   no bad-faith arguments about union vs. non-union. Disagreements are
   fine; attacks are not.

---

## How to Contribute Code

```bash
# 1. Fork and clone
git clone https://github.com/<your-handle>/IronForge.git
cd IronForge
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY

# 2. Create a branch
git checkout -b fix/wa-bond-amount
# or: feat/add-new-certification-pathway

# 3. Make your change, then verify
npm run lint
npx tsc --noEmit
npm run dev

# 4. Commit with a clear message
git commit -m "fix(wa): correct specialty contractor bond amount ($12k -> $15k)"

# 5. Push and open a pull request against `main`
git push origin fix/wa-bond-amount
```

### Pull request checklist

- [ ] `npm run lint` passes.
- [ ] `npx tsc --noEmit` passes (strict mode — no `any`).
- [ ] For regulatory data changes: include the **agency URL** and the
      **date you verified it** in the PR description.
- [ ] For content changes: preserve the existing hand-crafted vs.
      generated file structure in `content/`.
- [ ] Keep PRs focused. One logical change per PR.
- [ ] Added/updated tests if the change touches business logic.

---

## Regulatory Data Contributions (Highest Value)

IronForge's moat is **accurate, current regulatory data for all 50
states**. If you spot stale info, please submit a correction.

**Required evidence in every data-change PR:**

| Field | Example |
|---|---|
| State | Washington |
| Phase / Step | Licensing → Specialty Contractor |
| Old value | Bond: \$12,000 |
| New value | Bond: \$15,000 |
| Source URL | https://lni.wa.gov/... |
| Date verified | 2026-02-15 |
| Notes (optional) | Increased per RCW 18.27.040 effective 2026-01-01 |

Data PRs without a verifiable source URL will not be merged.

---

## Union Data Contributions

If you're a member, business agent, or organizer and you see a local
union's info out of date (hall phone, jurisdictional boundary, district
council, trust fund percentages):

1. Open an issue titled `Union data: Local <##> — <city>`.
2. Include what's wrong and what it should be.
3. If you have a hall phone number, please verify it works before
   submitting.

For sensitive info (internal contacts, non-public CBA terms), email
**licensing@structupath.ai** instead of opening a public issue.

---

## Contributor License Agreement (CLA)

All Contributions are accepted under the **[IronForge CLA](cla.md)**.
The full legal text lives in [`cla.md`](cla.md); the short version:

1. You grant Licensor a perpetual, worldwide, royalty-free license to
   use your Contribution and to **relicense it under both AGPL-3.0 and
   the IronForge Commercial License** (see [`LICENSE-COMMERCIAL.md`](LICENSE-COMMERCIAL.md)).
2. You confirm each Contribution is your original work (or you have
   the right to submit it).
3. Licensor has no obligation to accept, merge, or ship any Contribution.
4. Contributions are provided "as is" with no warranty.
5. If you're contributing on behalf of an employer, union, or other
   organization, you represent that you're authorized to bind it.

### How signing works

When you open your first pull request, a **CLA Assistant bot** will
post a comment asking you to confirm you've read and agree to
[`cla.md`](cla.md). Reply to that comment with exactly:

> `I have read the CLA Document and I hereby sign the CLA`

Your signature is recorded against your GitHub handle. You only need
to sign once per handle — subsequent PRs skip the prompt.

If you're contributing on behalf of a company and need a **Corporate
CLA** executed before the PR, email
[licensing@structupath.ai](mailto:licensing@structupath.ai) first.

If you cannot agree to the CLA (e.g. employer policy prohibits it),
please open an issue describing the problem instead of submitting code.

---

## Code Style

- TypeScript strict mode. No `any`. Prefer `unknown` + validators.
- React 19 Server Components where possible; `"use client"` only when
  required (state, effects, browser APIs).
- Tailwind CSS 4 with the existing `@theme` config. Do **not** add a
  `tailwind.config.js`.
- Keep the cyberpunk design language consistent: neon cyan `#00f0ff`
  primary, JetBrains Mono for data/headings, Space Grotesk for body.
- File-size discipline: prefer splitting a component > 300 lines into
  smaller focused pieces in `components/wizard/` or `components/ui/`.

---

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add NAICS code 238120 to federal cert phase
fix(tx): correct workers' comp as voluntary (not mandatory)
docs(readme): update license section
chore(deps): bump @anthropic-ai/sdk to 0.79.0
refactor(chat): extract streaming logic to lib/ai/stream.ts
```

Scopes we use: `wa`, `or`, `tx`, `ca`, etc. for state-specific changes;
`wizard`, `chat`, `content`, `ui`, `api`, `auth`, `billing` for modules.

---

## Questions

- **General:** open a GitHub Discussion.
- **Security issue:** email **security@structupath.ai** (do NOT open a
  public issue).
- **Licensing / commercial use:** **licensing@structupath.ai**.
- **Regulatory data dispute:** open an issue with the `data:` prefix.

Built for the ironworkers who build everything else.
