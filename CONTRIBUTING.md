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

By submitting a pull request, issue-attached patch, code suggestion, or
any other contribution ("Contribution") to the IronForge repository, you
agree to the following:

1. **Grant of license.** You grant Steel-Tech / StructuPath ("Licensor")
   a perpetual, worldwide, non-exclusive, royalty-free, irrevocable
   license to use, reproduce, modify, display, perform, sublicense, and
   distribute your Contribution, **and to relicense your Contribution
   under both the AGPL-3.0 license and the IronForge Commercial License
   described in [LICENSE](LICENSE)**, including any future version of
   either license.

2. **Original work.** You represent that each Contribution is your
   original work, or that you have the right to submit it (e.g. your
   employer has given you permission, or the Contribution is itself
   under a compatible permissive license and you have noted that).

3. **No obligation.** You understand Licensor is under no obligation to
   accept, merge, or ship your Contribution.

4. **No warranty.** Contributions are provided "as is" without warranty
   of any kind.

5. **Identity.** You are at least the age of majority in your
   jurisdiction, or your parent/guardian has reviewed and accepted this
   CLA on your behalf.

If you are contributing on behalf of a company, union, or other
organization, you represent that you are authorized to submit the
Contribution and bind that organization to this CLA.

**No separate signing is required.** Opening a pull request or merging
a patch constitutes acceptance.

If you cannot agree to this CLA — for example because your employer
prohibits CLAs — please do not submit Contributions. You may still open
issues describing the problem.

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
