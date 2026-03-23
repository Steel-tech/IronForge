# IronForge

AI-powered wizard to help ironworkers start their contracting business in all 50 US states.

## Design System
**Cyberpunk / Matrix / Tron / Futuristic** dark theme with neon accents.

### Color Palette
- **Backgrounds:** `cyber-black` (#0a0a0f), `cyber-darker`, `cyber-dark`, `cyber-surface`
- **Borders:** `cyber-border` (#2a2a40), `cyber-border-bright`
- **Neon Accents:** `neon-cyan` (primary), `neon-magenta` (chat/secondary), `neon-green` (success), `neon-amber` (tips), `neon-red` (warnings), `neon-blue` (links)
- **Text:** `text-primary`, `text-secondary`, `text-muted`

### Visual Effects
- Matrix digital rain canvas background
- Tron perspective grid
- Scanline overlay
- Glitch text on logo
- Neon glow borders & text shadows
- Staggered fade-in animations

### UI Components
- Built on **shadcn/ui** (components/ui/)
- Custom cyberpunk variants in globals.css (`.btn-neon-solid`, `.btn-neon-cyan`, `.cyber-card`, etc.)
- Fonts: **JetBrains Mono** (headings/data) + **Space Grotesk** (body)

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 (no config file - uses `@theme` in CSS)
- shadcn/ui components
- Anthropic Claude API (`@anthropic-ai/sdk`)
- localStorage for progress persistence (no auth/DB for MVP)

## Project Structure
- `app/` - Next.js App Router pages and API routes
- `components/wizard/` - Wizard UI components
- `components/ui/` - shadcn/ui base components + matrix-rain, tron-grid
- `content/` - Knowledge base (all 50 states + shared content)
  - `content/state-registry.ts` - Central data source for all 50 states (2000+ lines)
  - `content/generators/*.ts` - 5 generator functions that produce Phase objects from registry data
  - `content/washington/*.ts` - Hand-crafted WA content (highest detail)
  - `content/oregon/*.ts` - Hand-crafted OR content (highest detail)
  - `content/shared/*.ts` - Shared educational content (bonding, insurance, federal certs, legal)
  - `content/phases.ts` - Router: uses hand-crafted WA/OR, generators for other 48 states
- `lib/types/` - TypeScript types
- `lib/store/` - localStorage state management
- `lib/ai/` - Claude system prompt builder
- `lib/utils.ts` - cn() utility for class merging

## Key Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit   # Type check
```

## Content Structure
- State-specific content in `content/washington/` and `content/oregon/`
- Shared content in `content/shared/`
- Phase routing in `content/phases.ts`
- All regulatory info sourced from official state websites

## Environment
- Requires `ANTHROPIC_API_KEY` in `.env.local`
