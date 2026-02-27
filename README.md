# IronForge

**AI-powered wizard to help ironworkers start their contracting business in Washington or Oregon.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Claude API](https://img.shields.io/badge/Claude_API-Anthropic-D4A574)

## Overview

IronForge is a free, step-by-step web application that walks ironworkers through everything they need to launch a legitimate contracting business in Washington or Oregon. It combines a structured 6-phase wizard with an AI mentor powered by Claude that answers questions in plain English — no jargon, no guesswork.

The app covers LLC formation, contractor licensing, surety bonding, insurance, small business certifications, and federal contracting prep, with state-specific requirements, real cost estimates, and direct links to official forms and agencies.

## Features

- **6-Phase Guided Wizard** — Structured path from business formation through federal contracting readiness
- **AI Mentor** — Claude-powered streaming chat that understands your current step, state, and profile
- **State-Specific Guidance** — Tailored requirements for Washington (L&I) and Oregon (CCB)
- **Interactive Checklists** — Track progress through each step with persistent checkboxes
- **Cost & Time Estimates** — Real-world costs and timelines for every requirement
- **Resource Links** — Direct links to official state forms, agencies, and applications
- **Profile-Aware** — Surfaces relevant certifications based on veteran status, minority ownership, etc.
- **Progress Persistence** — Saves your place in localStorage (no account required)
- **Responsive Design** — Works on desktop and mobile

## Screenshots

> _Screenshots coming soon. Run the app locally to see it in action._

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) (CSS-first config with `@theme`) |
| Icons | [Lucide React](https://lucide.dev/) |
| AI | [Anthropic Claude API](https://docs.anthropic.com/) (`@anthropic-ai/sdk`) |
| State | localStorage (no database for MVP) |

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
│   ├── page.tsx                      # Landing page (state selection, profile setup)
│   ├── layout.tsx                    # Root layout
│   ├── api/chat/route.ts            # Streaming Claude AI endpoint
│   └── wizard/
│       ├── layout.tsx                # Wizard shell layout
│       ├── [phase]/[step]/page.tsx   # Dynamic wizard step page
│       └── summary/page.tsx          # Completion summary
├── components/wizard/
│   ├── chat-panel.tsx                # AI mentor chat interface
│   ├── checklist.tsx                 # Interactive step checklist
│   ├── cost-card.tsx                 # Cost & time estimate card
│   ├── progress-sidebar.tsx          # Phase/step navigation sidebar
│   ├── resource-link.tsx             # External resource link component
│   └── step-content.tsx              # Step content renderer
├── content/
│   ├── phases.ts                     # Phase definitions & routing logic
│   ├── washington/                   # WA-specific content
│   │   ├── business-formation.ts
│   │   ├── contractor-license.ts
│   │   ├── bonding.ts
│   │   ├── insurance.ts
│   │   └── certifications.ts
│   ├── oregon/                       # OR-specific content
│   │   ├── business-formation.ts
│   │   ├── contractor-license.ts
│   │   ├── bonding.ts
│   │   ├── insurance.ts
│   │   └── certifications.ts
│   └── shared/                       # Content shared across states
│       ├── bonding-education.ts
│       ├── insurance-education.ts
│       ├── federal-certifications.ts
│       └── legal-resources.ts
└── lib/
    ├── ai/
    │   └── system-prompts.ts         # Context-aware Claude system prompt builder
    ├── store/
    │   ├── progress.ts               # Checklist progress persistence
    │   ├── user-profile.ts           # User profile persistence
    │   └── chat-history.ts           # Chat history persistence
    └── types/
        ├── wizard.ts                 # UserProfile, WizardProgress, UserState
        ├── content.ts                # Phase, Step, content type definitions
        └── chat.ts                   # Chat message types
```

## The 6 Phases

| # | Phase | What It Covers |
|---|-------|---------------|
| 1 | **Business Formation** | LLC setup, EIN, bank account, state tax registration |
| 2 | **Contractor Licensing** | State contractor registration and licensing requirements |
| 3 | **Surety Bonding** | Bid, performance, and payment bonds explained in plain English |
| 4 | **Insurance Coverage** | GL, workers' comp, commercial auto, and tools coverage |
| 5 | **Certifications & Set-Asides** | SDVOSB, MBE/DBE, 8(a), HUBZone, and state programs |
| 6 | **Legal & Federal Contracting** | Construction attorney, SAM.gov, NAICS codes, capability statements |

## Architecture

### Content System

Content is organized by state and topic. Each phase pulls from state-specific modules (`content/washington/`, `content/oregon/`) and shared educational content (`content/shared/`). The `getPhaseContent()` function in `content/phases.ts` merges shared and state-specific content at runtime.

### Wizard Routing

The wizard uses dynamic App Router segments: `/wizard/[phase]/[step]`. Navigation between steps and phases is handled by `getNextStep()` and `getPrevStep()` functions that walk the phase/step tree.

### AI Integration

The `/api/chat` route builds a context-aware system prompt using the user's current phase, step, state, and profile. Responses stream back from Claude via the Anthropic SDK, giving the user a real-time conversational mentor experience.

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
