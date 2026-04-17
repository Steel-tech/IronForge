<div align="center">

# ⠀⟨⠀I⠀⟩⠀IronForge

### AI-Powered Contractor Launchpad for Ironworkers

**From apprentice to signatory contractor — every step, every state, one platform.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000?logo=next.js&logoColor=fff)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=fff)](https://react.dev/)
[![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000?logo=shadcnui&logoColor=fff)](https://ui.shadcn.com/)
[![Claude API](https://img.shields.io/badge/Claude_API-Anthropic-D4A574)](https://docs.anthropic.com/)
[![Coverage](https://img.shields.io/badge/coverage-50_states-00f0ff)](#coverage)
[![License: AGPL-3.0 + Commercial](https://img.shields.io/badge/license-AGPL--3.0%20%2B%20Commercial-00f0ff)](#license)

<br />

[Getting Started](#getting-started) · [Architecture](#architecture) · [Tech Stack](#tech-stack) · [Contributing](#contributing)

</div>

---

## Overview

IronForge is a full-stack web application that guides ironworkers through every phase of launching a legitimate contracting business — from LLC formation and state licensing to surety bonding, workers' compensation, union signatory agreements, federal certifications, and first-bid readiness.

The platform serves all 50 US states with a data-driven content engine that renders state-specific regulatory requirements, costs, timelines, and resource links. An integrated AI mentor (Claude) provides contextual guidance scoped to the user's current phase, step, jurisdiction, and profile.

### Key Differentiators

- **Domain-specific** — built for structural steel and ironwork contractors, not generic small business
- **Regulatory accuracy** — state-level licensing agencies, bond amounts, workers' comp classification (monopolistic / competitive / private), prevailing wage thresholds, and MBE/WBE/DBE certification programs
- **Union integration** — Ironworkers local union directory with hall contact info, CBA education, trust fund obligation breakdowns, and signatory contractor onboarding for every state
- **Zero auth MVP** — localStorage persistence, no database, no accounts — optimized for fast iteration

---

## Features

| Category | Details |
|----------|---------|
| **7-Phase Wizard** | Business Formation → Licensing → Bonding → Insurance → Certifications → Union Signatory → Legal & Federal |
| **50-State Coverage** | State registry with licensing fees, SOS URLs, tax rates, WC type, prevailing wage, union locals |
| **AI Mentor** | Claude-powered streaming chat with per-step system prompts, profile-aware context, and resource grounding |
| **Union Signatory** | Local-by-local Ironworkers contact info, CBA walkthrough, trust fund obligations, dispatch procedures |
| **Progress Tracking** | Per-step checklists persisted to localStorage with phase completion metrics |
| **Profile Engine** | Veteran, SDVOB, MBE, WBE flags surface relevant certification pathways |
| **Responsive** | Desktop 3-panel layout (sidebar + content + chat), mobile with collapsible panels |

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Runtime** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) | Server components, streaming, file-system routing |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) | Strict mode, exhaustive type checking on state data |
| **UI Framework** | [React 19](https://react.dev/) | `use()` for params, concurrent features |
| **Component Library** | [shadcn/ui](https://ui.shadcn.com/) | Accessible primitives (Button, Card, Input, Checkbox, ScrollArea, etc.) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | CSS-first `@theme` config, no `tailwind.config.js` |
| **Icons** | [Lucide React](https://lucide.dev/) + custom `<IBeamIcon />` | Tree-shakeable SVGs, domain-specific brand icon |
| **Fonts** | [JetBrains Mono](https://www.jetbrains.com/lp/mono/) / [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | Monospace for data/headings, geometric sans for body |
| **AI** | [Anthropic Claude API](https://docs.anthropic.com/) (`@anthropic-ai/sdk`) | Streaming responses, context-window-friendly system prompts |
| **State** | `localStorage` | No-auth MVP persistence for profile, progress, and chat history |

---

## Design System

Cyberpunk-inspired dark UI with structural steel branding.

```
Backgrounds   #0a0a0f → #0d0d14 → #12121c → #1a1a2e
Borders       #2a2a40 → #3a3a55
Neon Cyan     #00f0ff    Primary accent, active states, CTA
Neon Magenta  #ff00aa    Chat panel, secondary accent
Neon Green    #00ff41    Success, completion, matrix rain
Neon Amber    #ffaa00    Tips, warnings
Neon Red      #ff0040    Errors, required indicators
```

**Visual effects:** Matrix digital rain (canvas), Tron perspective grid (CSS), scan-line overlay, glitch text animation, neon glow borders, staggered fade-in transitions.

---

## Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| Anthropic API Key | [console.anthropic.com](https://console.anthropic.com/) |

### Quick Start

```bash
git clone https://github.com/Steel-tech/IronForge.git
cd IronForge
npm install
cp .env.example .env.local
```

Add your API key to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |

---

## Architecture

### Content Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                    State Registry                        │
│              (50 states × 25+ fields)                   │
│   fees · URLs · agencies · tax · WC · unions · certs    │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌─────────┐  ┌──────────┐  ┌─────────────┐
   │ Hand-   │  │ Generator│  │   Shared     │
   │ Crafted │  │ Functions│  │   Content    │
   │ (WA/OR) │  │ (48 st.) │  │ (education) │
   └────┬────┘  └────┬─────┘  └──────┬──────┘
        │             │               │
        └─────────────┼───────────────┘
                      ▼
              ┌──────────────┐
              │  phases.ts   │
              │   (router)   │
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │   Wizard UI  │
              │  components  │
              └──────────────┘
```

**Hybrid content strategy:**
- **Hand-crafted** — WA and OR have 5 detailed files each (~1,400 lines) with granular regulatory data, curated resource links, and trade-specific guidance
- **Generated** — The remaining 48 states use 6 generator functions that produce `Phase` objects from the central state registry
- **Shared** — Educational content (bond types, insurance fundamentals, federal certifications, union education, legal prep) is state-agnostic and merged at render time
- **Routing** — `getPhaseContent(phaseId, stateCode)` checks for hand-crafted content first, falls back to generated

### Workers' Compensation Classification

| Type | States | Behavior |
|------|--------|----------|
| **Monopolistic** | WA, OH, ND, WY | State fund is the only carrier. No private option. |
| **Competitive** | OR, CO, UT, AZ, CA, NV, + others | State fund competes with private carriers. |
| **Private Only** | TX, FL, GA, AL, + others | Private carriers exclusively. TX is voluntary. |

### Wizard Routing

Dynamic segments via App Router: `/wizard/[phase]/[step]`

Navigation is computed by `getNextStep()` and `getPrevStep()`, which walk the phase/step tree for the user's selected state. Step IDs are stable across states; step *content* varies by jurisdiction.

### AI Integration

The `/api/chat` endpoint builds a system prompt that includes:
- Current phase, step title, and description
- Full checklist with descriptions and resource URLs
- Tips, warnings, cost/time estimates
- User profile (state, veteran status, certifications, experience)
- Grounding rules to prevent hallucination

Responses stream via `ReadableStream` using Anthropic's `messages.stream()` API.

---

## Project Structure

```
ironforge/
├── app/
│   ├── layout.tsx                      Root layout (fonts, theme, scan-lines)
│   ├── page.tsx                        Landing (50-state selector, profile)
│   ├── globals.css                     Cyberpunk theme, effects, animations
│   ├── api/chat/route.ts              Streaming Claude endpoint
│   └── wizard/
│       ├── layout.tsx                  Auth guard, loading state
│       ├── [phase]/[step]/page.tsx     Wizard step (sidebar + content + chat)
│       └── summary/page.tsx            Progress summary
│
├── components/
│   ├── ui/                             shadcn/ui primitives + custom
│   │   ├── ibeam-icon.tsx              Structural steel I-beam brand icon
│   │   ├── matrix-rain.tsx             Canvas digital rain effect
│   │   └── tron-grid.tsx               CSS perspective grid
│   └── wizard/
│       ├── progress-sidebar.tsx        Phase/step nav with completion state
│       ├── step-content.tsx            Step renderer (checklist, costs, tips)
│       ├── chat-panel.tsx              AI mentor (streaming, suggestions)
│       ├── checklist.tsx               Interactive checklist with neon states
│       ├── cost-card.tsx               Cost/time estimate card
│       └── resource-link.tsx           External resource with type icon
│
├── content/
│   ├── state-registry.ts              ★ 50-state data source (2,000+ lines)
│   ├── phases.ts                       Phase definitions + routing logic
│   ├── generators/                     Content generators (6 files)
│   ├── washington/                     Hand-crafted WA content (5 files)
│   ├── oregon/                         Hand-crafted OR content (5 files)
│   └── shared/                         Educational content (5 files)
│
└── lib/
    ├── ai/system-prompts.ts            50-state-aware prompt builder
    ├── store/                          localStorage persistence (3 files)
    ├── types/                          TypeScript interfaces (3 files)
    └── utils.ts                        cn() class merging utility
```

---

## The 7 Phases

| # | Phase | Steps | Scope |
|---|-------|-------|-------|
| 1 | **Business Formation** | 5 | LLC structure, filing, EIN, bank account, state tax registration |
| 2 | **Contractor Licensing** | 3 | State license/registration, specialty classifications, prevailing wage |
| 3 | **Surety Bonding** | 5 | Bond education (shared) + state-specific bond requirements |
| 4 | **Insurance Coverage** | 5 | GL, workers' comp, commercial auto, tools/inland marine, umbrella |
| 5 | **Certifications** | 6 | SAM.gov, SDVOSB, 8(a), HUBZone, DBE/MBE + state programs |
| 6 | **Union Signatory** | 5 | CBA education, trust funds, signing process, bidding + state locals |
| 7 | **Legal & Federal** | 5 | Attorney, NAICS codes, capability statement, set-asides, first bid |

---

## Coverage

### State Data Points (per state)

| Field | Example (Colorado) |
|-------|-------------------|
| LLC Filing Fee | $50 |
| Annual Report | $10 (Periodic Report) |
| State Income Tax | Flat 4.4% |
| Sales Tax | 2.9% + local |
| Contractor License | None (local control) |
| State Bond | Not required |
| Workers' Comp | Competitive (Pinnacol Assurance) |
| Prevailing Wage | No state law |
| Certification Program | SBE/DBE/MBE/WBE |
| Ironworkers Local | Local 24 (Denver) — covers CO + WY |
| District Council | Rocky Mountain Area |

### Union Local Coverage

Every state maps to one or more Ironworkers locals with:
- Local name and number
- City and jurisdictional coverage
- Direct phone number
- Local union hall website
- District council affiliation

States with multiple locals (e.g., CA: 433, 377, 118 · NY: 40, 580, 6, 12 · TX: 263, 84, 482) display all with jurisdiction boundaries.

---

## Roadmap

- [ ] Supabase backend (auth, persistent profiles, progress sync)
- [ ] PDF export for checklists and capability statements
- [ ] Admin CMS for state registry data management
- [ ] Hand-crafted content expansion beyond WA/OR
- [ ] Estimating calculator integration
- [ ] Mobile-native app (React Native / Expo)

---

## Contributing

Contributions are welcome! If you're an ironworker, contractor, or industry professional with corrections to state-specific data, please open an issue or submit a pull request.

---

## License

IronForge is offered under a **dual license**:

1. **[GNU Affero General Public License v3.0](LICENSE-AGPL)** — free to use,
   modify, and self-host, provided that any modifications or network-deployed
   derivatives are released under the same AGPL-3.0 terms, with complete
   corresponding source code made available to every user who interacts with
   the software over a network (AGPL §13).

2. **IronForge Commercial License** — required for closed-source SaaS
   offerings, white-label resellers, embedding in proprietary products, or
   any use incompatible with AGPL-3.0's source-disclosure obligations. Also
   required for use of the 50-state regulatory dataset, Ironworkers local
   directory, or hand-crafted content as training/fine-tuning/RAG data for
   another product.

The "IronForge" name, the `⟨ I ⟩` I-beam mark, the cyberpunk design
system, and the "StructuPath" name are trademarks and are **not** granted
under AGPL-3.0 — forks must rename and re-skin.

See [LICENSE](LICENSE) for full terms. For commercial licensing, contact
**licensing@structupath.ai**.

Contributions are accepted under the [Contributor License Agreement](CONTRIBUTING.md).

---

<div align="center">

**Built for the ironworkers who build everything else.**

Made with grit by [StructuPath](https://github.com/Steel-tech)

</div>
