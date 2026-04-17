# IronForge Commercial License

**Copyright © 2026 Steel-Tech / StructuPath. All rights reserved.**

> This file describes the **commercial licensing terms** that sit
> alongside the open-source license. The primary license for IronForge
> is the **GNU Affero General Public License, version 3 (AGPL-3.0)**,
> the full text of which is in the [`LICENSE`](LICENSE) file at the root
> of this repository.
>
> Where AGPL-3.0 is insufficient for your use case — or where your use
> touches the IronForge regulatory dataset, trademarks, or hosted-SaaS
> distribution — a **Commercial License** is available from StructuPath.

---

## 1 · Summary

IronForge is offered under a **dual license**:

1. **AGPL-3.0** (default, free) — use, modify, and self-host, provided
   that any modified or network-deployed version is released under
   AGPL-3.0 with complete corresponding source code made available to
   every user who interacts with the software over a network (AGPL §13).

2. **IronForge Commercial License** (this file) — required when
   AGPL-3.0 terms cannot or will not be met, or when use extends beyond
   what AGPL-3.0 grants (see §3 below).

If you are building a competing hosted product, embedding IronForge into
a closed-source commercial offering, or otherwise cannot satisfy
AGPL §13, you **must** obtain a commercial license before deploying.

**Contact:** [licensing@structupath.ai](mailto:licensing@structupath.ai)
· [https://ironforge.app/licensing](https://ironforge.app/licensing)

---

## 2 · When AGPL-3.0 Is Enough

You do **not** need a commercial license if all of the following are true:

- You use IronForge internally (personal, educational, single-company
  research) without offering it as a service to third parties; **or**
- You offer a hosted version to others **and** you publish the complete
  corresponding source code of your modified IronForge under AGPL-3.0
  to every network user (AGPL §13); **and**
- You are **not** using the IronForge Content (defined in §4 below) as
  training, fine-tuning, RAG, or dataset material for another product;
  **and**
- You are **not** using the IronForge trademarks, brand, or visual
  identity in a public-facing deployment or distribution (§5).

If you are unsure, assume you need to ask.

---

## 3 · When a Commercial License Is Required

A Commercial License is required for any of the following uses:

1. **Closed-source SaaS.** Operating IronForge (modified or not) as a
   hosted or SaaS offering to third parties without releasing your
   modifications under AGPL-3.0.

2. **Proprietary redistribution.** Bundling, embedding, or
   redistributing IronForge, in whole or in part, as a component of a
   proprietary product, service, or white-label offering.

3. **Trademark or brand retention.** Deploying IronForge publicly
   without removing or replacing the "IronForge" name, the `⟨ I ⟩`
   I-beam mark, the cyberpunk visual design system, the "StructuPath"
   name, or any other IronForge marks (§5).

4. **Dataset / AI training.** Using the 50-state regulatory dataset,
   hand-crafted Washington and Oregon content, the Ironworkers local
   directory, or the AI system prompts as training data, fine-tuning
   corpus, retrieval-augmented-generation index, evaluation benchmark,
   or dataset for any product or model other than unmodified IronForge.

5. **District council, franchise, or enterprise deployment.** Any use by
   a union district council, local union, franchise operator, or
   enterprise customer requiring indemnification, a service-level
   agreement, warranty, support, or data-processing agreements beyond
   what AGPL-3.0 offers.

6. **Policy incompatibility.** Your legal, procurement, or compliance
   policies prohibit use of copyleft-licensed software in your stack.

---

## 4 · IronForge Content

"**IronForge Content**" means the following copyrighted works,
independent of the application code:

- The 50-state regulatory dataset (`content/state-registry.ts` and any
  derivatives), including but not limited to LLC filing fees, state
  bond amounts, workers' compensation classifications, prevailing wage
  thresholds, tax rates, and Secretary of State filing procedures;
- The Ironworkers local directory, including hall contact info,
  jurisdictional boundaries, district council affiliations, and trust
  fund obligation breakdowns;
- Hand-crafted Washington and Oregon content (`content/washington/*`,
  `content/oregon/*`);
- Shared educational content (`content/shared/*`);
- AI system prompts, grounding rules, and mentor instructions
  (`lib/ai/*`).

Under AGPL-3.0, you may use, modify, and redistribute the IronForge
Content so long as your entire derivative work is licensed under
AGPL-3.0 **and** you preserve the copyright notice and attribution.
Use of IronForge Content as training, fine-tuning, RAG, or dataset
material for another product requires a Commercial License (§3.4).

---

## 5 · Trademarks

The "**IronForge**" name, the `⟨ I ⟩` I-beam mark, the cyberpunk visual
design system (including the neon cyan `#00f0ff` / magenta `#ff00aa`
palette, matrix-rain effect, Tron perspective grid, and scan-line
overlay), and the "**StructuPath**" name are **trademarks** of
Steel-Tech / StructuPath.

Trademarks are **not** granted under AGPL-3.0. You may not use these
marks in any derivative, fork, or hosted deployment without prior
written permission. **Any public fork must be renamed and re-skinned.**

Nominative fair-use references ("this tool is based on IronForge",
blog-post reviews, academic citations) are permitted.

---

## 6 · Tiers & Pricing (indicative)

Exact pricing depends on deployment scope. Indicative ranges:

| Tier | Audience | Typical Range |
|---|---|---|
| **Individual / Solo Contractor** | Self-hosted with trademark retention | — (use AGPL-3.0) |
| **Signatory Contractor Association** | Member-benefit redistribution | $5k–$25k / year |
| **Apprenticeship / Training Program** | Curriculum use + student seats | $2k–$10k / program |
| **IW District Council** | Co-branded "[Council] Signatory Launchpad" | $25k–$100k / year |
| **Surety / Broker Partnership** | White-label + qualified lead pipeline | $50k–$250k / year |
| **Enterprise / SaaS Competitor** | Closed-source hosted offering | Negotiated |

Commercial licenses include:

- Grant of the specified rights (closed-source hosting, trademark use,
  dataset access, etc.);
- Software warranty and indemnification appropriate to the tier;
- Named support contact and response-time SLA;
- Quarterly regulatory-dataset update feed;
- Priority AI mentor queue for licensed deployments.

---

## 7 · Contributions

Contributions to the upstream IronForge repository are accepted under
the [Contributor License Agreement](CONTRIBUTING.md), which grants
Licensor the right to relicense the contribution under both AGPL-3.0
and this Commercial License. Contributors should read `CONTRIBUTING.md`
before opening a pull request.

---

## 8 · No Warranty

IronForge provides **informational guidance** about state licensing,
bonding, insurance, and union signatory processes. It is **not** legal,
tax, financial, or insurance advice. State regulations change;
StructuPath makes no warranty that the IronForge Content is current,
complete, or error-free. Users are responsible for verifying
requirements with the appropriate state agencies, local unions,
attorneys, and licensed advisors before taking action.

The software is provided "**as is**", without warranty of any kind,
except where a separate written Commercial License Agreement explicitly
provides otherwise.

---

## 9 · Termination

Any violation of AGPL-3.0 or of the commercial terms above, including
failure to disclose corresponding source under AGPL §13 or unauthorized
use of the IronForge trademarks or Content, **automatically terminates**
your rights under the applicable license. See AGPL §8 for reinstatement
procedures under AGPL-3.0.

---

## 10 · Contact

| Purpose | Email |
|---|---|
| Commercial licensing, pricing, procurement | [licensing@structupath.ai](mailto:licensing@structupath.ai) |
| Security vulnerabilities (not public) | [security@structupath.ai](mailto:security@structupath.ai) |
| General inquiries | [hello@ironforge.app](mailto:hello@ironforge.app) |

For the full text of AGPL-3.0, see [`LICENSE`](LICENSE) or
<https://www.gnu.org/licenses/agpl-3.0.txt>.
