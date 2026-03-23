# IronForge

**AI-powered wizard to help ironworkers start their contracting business — all 50 US states.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-000000?logo=shadcnui)
![Claude API](https://img.shields.io/badge/Claude_API-Anthropic-D4A574)
![States](https://img.shields.io/badge/Coverage-50_States-00f0ff)

## Overview

IronForge is a free, step-by-step web application that walks ironworkers through everything they need to launch a legitimate contracting business in any US state. It combines a structured 7-phase wizard with an AI mentor powered by Claude that answers questions in plain English — no jargon, no guesswork.

The app covers LLC formation, contractor licensing, surety bonding, insurance, small business certifications, becoming a union signatory contractor, and federal contracting prep — with state-specific requirements, real cost estimates, local Ironworkers union info, and direct links to official forms and agencies.

## Features

- **7-Phase Guided Wizard** — Structured path from business formation through union signatory and federal contracting readiness
- **All 50 States** — State-specific licensing, bonding, tax, insurance, and union data for every US state
- **AI Mentor** — Claude-powered streaming chat that understands your current step, state, and profile
- **Union Signatory Guide** — Local Ironworkers union contact info, CBA walkthrough, trust fund obligations, and hiring hall procedures for every state
- **Interactive Checklists** — Track progress through each step with persistent checkboxes
- **Cost & Time Estimates** — Real-world costs and timelines for every requirement
- **Resource Links** — Direct links to official state forms, agencies, union halls, and applications
- **Profile-Aware** — Surfaces relevant certifications based on veteran status, minority ownership, etc.
- **Cyberpunk UI** — Dark theme with neon accents, matrix rain, Tron grid, and glitch effects
- **Progress Persistence** — Saves your place in localStorage (no account required)
- **Responsive Design** — Works on desktop and mobile

## Screenshots

> _Screenshots coming soon. Run the app locally to see it in action._

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) (CSS-first config with `@theme`) |
| Icons | [Lucide React](https://lucide.dev/) + custom I-beam SVG |
| AI | [Anthropic Claude API](https://docs.anthropic.com/) (`@anthropic-ai/sdk`) |
| Fonts | [JetBrains Mono](https://www.jetbrains.com/lp/mono/) + [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) |
| State | localStorage (no database for MVP) |

## Design System

**Cyberpunk / Matrix / Tron / Futuristic** dark theme.

- **Backgrounds:** Jet black → dark surfaces with subtle grid patterns
- **Accents:** Neon cyan (primary), magenta (chat), green (success), amber (tips), red (warnings)
- **Effects:** Matrix digital rain, Tron perspective grid, scan-line overlay, glitch text, neon glow borders
- **Typography:** JetBrains Mono for headings/data, Space Grotesk for body text

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm**
- An **Anthropic API key** ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/Steel-tech/IronForge.git
cd IronForge

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# Start the dev server
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude AI chat |

See `.env.example` for the template.

## Project Structure

```
ironforge/
├── app/
│   ├── page.tsx                        # Landing page (50-state selector, profile setup)
│   ├── layout.tsx                      # Root layout (fonts, dark theme, scan-lines)
│   ├── globals.css                     # Cyberpunk theme, neon effects, animations
│   ├── api/chat/route.ts              # Streaming Claude AI endpoint
│   └── wizard/
│       ├── layout.tsx                  # Wizard shell layout
│       ├── [phase]/[step]/page.tsx     # Dynamic wizard step page
│       └── summary/page.tsx            # Completion summary
│
├── components/
│   ├── ui/                             # shadcn/ui base components
│   │   ├── button.tsx, card.tsx, ...   # Standard shadcn primitives
│   │   ├── ibeam-icon.tsx              # Custom I-beam (structural steel) SVG icon
│   │   ├── matrix-rain.tsx             # Canvas-based Matrix digital rain effect
│   │   └── tron-grid.tsx               # Tron perspective grid background
│   └── wizard/
│       ├── chat-panel.tsx              # AI mentor chat interface
│       ├── checklist.tsx               # Interactive step checklist
│       ├── cost-card.tsx               # Cost & time estimate card
│       ├── progress-sidebar.tsx        # Phase/step navigation sidebar
│       ├── resource-link.tsx           # External resource link component
│       └── step-content.tsx            # Step content renderer
│
├── content/
│   ├── phases.ts                       # Phase definitions & routing (hand-crafted → generated fallback)
│   ├── state-registry.ts              # ★ All 50 states data (fees, URLs, agencies, unions, 2000+ lines)
│   ├── generators/                    # Dynamic content generators from state registry
│   │   ├── business-formation.ts       # LLC formation Phase generator
│   │   ├── contractor-license.ts       # Licensing Phase generator
│   │   ├── bonding.ts                  # Bonding Phase generator
│   │   ├── insurance.ts               # Insurance Phase generator
│   │   ├── certifications.ts          # Certifications Phase generator
│   │   └── union-signatory.ts         # Union signatory Phase generator
│   ├── washington/                    # Hand-crafted WA content (highest detail)
│   │   ├── business-formation.ts
│   │   ├── contractor-license.ts
│   │   ├── bonding.ts
│   │   ├── insurance.ts
│   │   └── certifications.ts
│   ├── oregon/                        # Hand-crafted OR content (highest detail)
│   │   ├── business-formation.ts
│   │   ├── contractor-license.ts
│   │   ├── bonding.ts
│   │   ├── insurance.ts
│   │   └── certifications.ts
│   └── shared/                        # Educational content shared across all states
│       ├── bonding-education.ts        # Surety bond education (types, getting bonded, capacity)
│       ├── insurance-education.ts      # Insurance education (GL, auto, tools, umbrella)
│       ├── federal-certifications.ts   # Federal certs (SAM.gov, SDVOSB, 8(a), HUBZone, DBE)
│       ├── union-signatory.ts         # Union education (CBA, trust funds, signing process, bidding)
│       └── legal-resources.ts          # Legal & federal contracting (attorney, NAICS, cap statement)
│
└── lib/
    ├── ai/
    │   └── system-prompts.ts           # Context-aware Claude system prompt builder (50-state aware)
    ├── store/
    │   ├── progress.ts                 # Checklist progress persistence
    │   ├── user-profile.ts             # User profile persistence
    │   └── chat-history.ts             # Chat history persistence
    ├── types/
    │   ├── wizard.ts                   # UserProfile, WizardProgress, UserState
    │   ├── content.ts                  # Phase, Step, content type definitions
    │   └── chat.ts                     # Chat message types
    └── utils.ts                        # cn() utility for class merging
```

## The 7 Phases

| # | Phase | What It Covers |
|---|-------|---------------|
| 1 | **Business Formation** | LLC setup, EIN, bank account, state tax registration |
| 2 | **Contractor Licensing** | State contractor registration/licensing, specialty trades, prevailing wage |
| 3 | **Surety Bonding** | Bond education + state-specific bond requirements |
| 4 | **Insurance Coverage** | GL, workers' comp (monopolistic vs competitive vs private), commercial auto, tools, umbrella |
| 5 | **Certifications & Set-Asides** | SAM.gov, SDVOSB, 8(a), HUBZone, DBE + state MBE/WBE programs |
| 6 | **Union Signatory Contractor** | CBA walkthrough, trust fund obligations, hiring hall, local Ironworkers union info |
| 7 | **Legal & Federal Contracting** | Construction attorney, NAICS codes, capability statements, set-aside contracts, first bid |

## Architecture

### Data-Driven Content System

Content uses a **hybrid hand-crafted + generated** approach:

- **State Registry** (`state-registry.ts`) — Central data source with all 50 states' regulatory data, fees, URLs, agencies, Ironworkers local unions, and tax info (~2,000+ lines)
- **Generators** (`generators/*.ts`) — 6 generator functions that produce `Phase` objects from registry data
- **Hand-Crafted** — Washington and Oregon have detailed, hand-written content files for maximum accuracy
- **Routing** (`phases.ts`) — Checks for hand-crafted content first, falls back to generated content

Each state's data includes:
- LLC filing fees and Secretary of State URLs
- Income tax rates and sales tax details
- Contractor licensing requirements (state-level vs local control)
- Bond requirements and amounts
- Workers' comp type (monopolistic / competitive state fund / private only)
- Prevailing wage thresholds and agencies
- State certification programs (MBE/WBE/DBE)
- Ironworkers local union(s): name, number, city, phone, website, jurisdiction, and district council

### Workers' Compensation Classification

| Type | States | Description |
|------|--------|-------------|
| **Monopolistic** | WA, OH, ND, WY | Must use state fund — no private carriers |
| **Competitive** | OR, CO, UT, AZ, CA, NV, + many more | State fund available alongside private carriers |
| **Private Only** | TX, FL, GA, AL, + many more | Private carriers only (TX: voluntary!) |

### Wizard Routing

The wizard uses dynamic App Router segments: `/wizard/[phase]/[step]`. Navigation between steps and phases is handled by `getNextStep()` and `getPrevStep()` functions that walk the phase/step tree.

### AI Integration

The `/api/chat` route builds a context-aware system prompt using the user's current phase, step, state (all 50 supported), and profile. Responses stream back from Claude via the Anthropic SDK, giving the user a real-time conversational mentor experience.

### State Management

All user data (profile, wizard progress, chat history) is stored in localStorage. No authentication or database is required — the user can pick up where they left off by returning to the same browser.

## Scripts

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build
npm start          # Start production server
npm run lint       # Run ESLint
npx tsc --noEmit   # Type check (no output)
```

## License

All rights reserved. License TBD.
