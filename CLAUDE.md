# IronForge

AI-powered wizard to help ironworkers start their contracting business in Washington or Oregon.

## Tech Stack
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4 (no config file - uses `@theme` in CSS)
- Anthropic Claude API (`@anthropic-ai/sdk`)
- localStorage for progress persistence (no auth/DB for MVP)

## Project Structure
- `app/` - Next.js App Router pages and API routes
- `components/wizard/` - Wizard UI components
- `content/` - Knowledge base (WA, OR, shared content)
- `lib/types/` - TypeScript types
- `lib/store/` - localStorage state management
- `lib/ai/` - Claude system prompt builder

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
