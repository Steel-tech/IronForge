# IronForge — License Overview

> This document is a **reader-friendly overview** of how IronForge is
> licensed. The legally binding texts are the sibling files:
>
> - **[`LICENSE`](../../LICENSE)** — verbatim AGPL-3.0 (GNU Affero
>   General Public License, version 3).
> - **[`LICENSE-COMMERCIAL.md`](../../LICENSE-COMMERCIAL.md)** — the
>   companion Commercial License terms, trademark reservation, dataset
>   restrictions, and contact for paid licenses.
>
> If anything in this overview conflicts with `LICENSE` or
> `LICENSE-COMMERCIAL.md`, the sibling files control.

---

## 1 · The Model: Dual License

IronForge uses a **dual-license** model common among open-source
vertical-SaaS companies (Sentry, Mattermost, Plausible, Grafana):

| Track | Audience | What it grants |
|---|---|---|
| **AGPL-3.0** | Individual ironworkers, researchers, transparent self-hosters, organizations willing to comply with AGPL §13 | Full right to use, modify, and self-host — *provided* every modification that users interact with over a network is released under AGPL-3.0 with full source disclosure. |
| **Commercial License** | Closed-source SaaS operators, white-label resellers, IW district councils, surety/broker partnerships, enterprises, anyone wanting trademark retention or dataset-as-training-data rights | A paid, negotiated license that removes AGPL obligations and grants warranty, indemnification, SLA, and the quarterly regulatory update feed. |

**Rule of thumb:** if you're self-hosting IronForge for your own use
(or your local's use) and you're willing to publish your changes — use
AGPL-3.0. If you're building a product on top of IronForge for paying
customers, or using the dataset to train anything — contact
`licensing@structupath.ai`.

---

## 2 · What Is Covered

**Code:** the Next.js application, React components, API routes,
TypeScript type definitions, generator functions, and build tooling
are licensed under AGPL-3.0.

**IronForge Content (see `LICENSE-COMMERCIAL.md` §4):** the 50-state
regulatory dataset, Ironworkers local directory, hand-crafted WA/OR
content, shared educational content, and AI system prompts are
**copyrighted works** of Steel-Tech / StructuPath. They are licensed
under AGPL-3.0 for use within the application, **but using them as
training, fine-tuning, or RAG data for a separate product requires a
Commercial License.**

**Trademarks:** "IronForge", the `⟨ I ⟩` I-beam mark, the cyberpunk
visual design system, and "StructuPath" are **trademarks** and are
**not** granted under AGPL-3.0. Public forks must rename and re-skin.

---

## 3 · Common Scenarios

| Scenario | License needed |
|---|---|
| Clone the repo, run it on your laptop, learn from it | ✅ AGPL-3.0 |
| Self-host for your local union with the AGPL source published | ✅ AGPL-3.0 |
| Fork, rename to "HardHatLaunch", re-skin, operate as a hosted service with source published under AGPL | ✅ AGPL-3.0 |
| Run a hosted service that keeps the IronForge branding | ❌ Commercial |
| Run a closed-source hosted service (don't want to publish modifications) | ❌ Commercial |
| IW District Council deployment with SLA, support, quarterly updates | ❌ Commercial |
| White-label surety-broker lead-gen product | ❌ Commercial |
| Use the 50-state dataset to train / fine-tune a separate LLM product | ❌ Commercial |
| Quote a sentence or statistic from IronForge in a blog post | ✅ nominative fair use, no license needed |

---

## 4 · Contributions

Contributions accepted via pull request are governed by the
[Contributor License Agreement in `CONTRIBUTING.md`](../../CONTRIBUTING.md),
which grants Steel-Tech / StructuPath the right to relicense the
contribution under both AGPL-3.0 and the Commercial License.

---

## 5 · Contacts

| Purpose | Email |
|---|---|
| Commercial licensing, enterprise pricing, procurement | [licensing@structupath.ai](mailto:licensing@structupath.ai) |
| Security vulnerabilities (not public) | [security@structupath.ai](mailto:security@structupath.ai) |
| General | [hello@ironforge.app](mailto:hello@ironforge.app) |

---

## 6 · Why We Picked AGPL + Commercial (not MIT, not strict proprietary)

**Why not MIT?** MIT allows any SaaS competitor to fork IronForge,
host it commercially, and retain no obligation back to the project.
For a product whose moat is the regulatory dataset, MIT is giving the
moat away.

**Why not strict proprietary / all-rights-reserved?** A working
ironworker wants to inspect the code before trusting it with their
business plan. Closed-source kills organic trust and the
"built-by-the-trade" credibility that is a competitive advantage.

**Why AGPL-3.0 specifically?** AGPL §13 — the "network clause" — closes
the SaaS loophole in GPL. A competitor can't take IronForge, modify it,
and run it as a closed service. They either publish their
modifications (which we benefit from) or they buy a Commercial License
(which we also benefit from). Both outcomes serve the project.

**The Commercial License exists so that** legitimate partners —
district councils, surety underwriters, contractor associations — have
a path to use IronForge that fits their legal posture (indemnification,
SLA, no copyleft obligations for their own code).
