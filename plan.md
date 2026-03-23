# IronForge Cyberpunk/Matrix/Tron Redesign Plan

## Vision
Transform IronForge from its current clean/corporate look into an immersive **cyberpunk/matrix/tron/futuristic** experience — your signature dark-mode aesthetic with neon accents, glowing borders, digital rain effects, scan-line textures, and a grid-based futuristic UI. Integrate **shadcn/ui** components for consistent, accessible base elements.

---

## Phase 1: Foundation — shadcn/ui + Dark Cyberpunk Theme

### 1.1 Install shadcn/ui
- Run `npx shadcn@latest init` in the project
- Configure for Tailwind CSS v4, dark mode, and New York style
- Set up `components/ui/` directory for shadcn primitives
- Install core components: `button`, `card`, `input`, `textarea`, `select`, `checkbox`, `badge`, `progress`, `separator`, `scroll-area`, `tooltip`, `dialog`

### 1.2 Cyberpunk Color System (globals.css `@theme`)
Replace the current `iron-*` / `forge-*` palette with a cyberpunk palette:

| Token | Color | Usage |
|-------|-------|-------|
| `--cyber-black` | `#0a0a0f` | Primary background |
| `--cyber-darker` | `#0d0d14` | Card backgrounds |
| `--cyber-dark` | `#12121c` | Elevated surfaces |
| `--cyber-surface` | `#1a1a2e` | Panels, sidebars |
| `--cyber-border` | `#2a2a40` | Borders, dividers |
| `--neon-cyan` | `#00f0ff` | Primary accent (Tron) |
| `--neon-magenta` | `#ff00aa` | Secondary accent |
| `--neon-green` | `#00ff41` | Success / matrix rain |
| `--neon-amber` | `#ffaa00` | Warnings, forge fire |
| `--neon-red` | `#ff0040` | Errors, danger |
| `--neon-blue` | `#0066ff` | Links, info |
| `--text-primary` | `#e0e0f0` | Primary text |
| `--text-secondary` | `#8888aa` | Muted text |
| `--text-glow` | `#00f0ff` | Glowing headings |

Integrate into shadcn CSS variables (`--primary`, `--secondary`, `--accent`, etc.).

### 1.3 Typography
- Import **JetBrains Mono** (monospace, code feel) for headings and data
- Import **Inter** or **Space Grotesk** for body text
- Add glow text utility classes: `.text-glow-cyan`, `.text-glow-magenta`, `.text-glow-green`

---

## Phase 2: Visual Effects Layer

### 2.1 CSS Animations & Effects (globals.css)
- **Scan-line overlay** — subtle horizontal lines across the entire viewport (CSS `::after` on body)
- **Neon glow borders** — `box-shadow` with colored blur for cards/panels
- **Pulse/breathe animations** — for active elements and the forge logo
- **Grid background pattern** — Tron-style grid lines on the background
- **Glitch text effect** — for the "IronForge" logo/title
- **Typing cursor blink** — for the AI chat streaming indicator
- **Fade-in-up** — for content sections on load

### 2.2 Matrix Digital Rain Background
- Lightweight CSS-only digital rain effect OR a small canvas component (`components/ui/matrix-rain.tsx`)
- Used subtly on the landing page hero behind content
- Low opacity so it doesn't distract from content

### 2.3 Tron Grid Floor
- CSS perspective grid effect for the landing page hero
- Gives depth and the "Tron: Legacy" feel
- Vanishing point grid receding into the background

---

## Phase 3: Component Redesign

### 3.1 Root Layout (`app/layout.tsx`)
- Dark body background (`bg-cyber-black`)
- Scan-line overlay
- Font loading (JetBrains Mono + Space Grotesk via `next/font`)
- Global neon glow focus ring styles

### 3.2 Landing Page (`app/page.tsx`)
- **Hero section**: Tron grid floor background + matrix rain
- **Logo**: "IRON`FORGE`" with glitch animation and cyan glow
- **Tagline**: Typewriter effect with blinking cursor
- **6-phase list**: Styled as a terminal readout with numbered lines (`01 >`, `02 >`, etc.) — neon green text
- **Buttons**: shadcn `Button` with neon cyan border glow, hover pulse effect
- **State selection**: Two glowing cards with hover neon border, WA=cyan, OR=magenta accent
- **Profile form**: shadcn `Input`, `Select`, `Checkbox` with cyberpunk styling — glowing borders on focus

### 3.3 Wizard Layout (`app/wizard/layout.tsx`)
- Same dark treatment, no changes to logic

### 3.4 Progress Sidebar (`components/wizard/progress-sidebar.tsx`)
- Dark panel (`bg-cyber-surface`) with left neon border accent
- Phase headers: monospace font, neon badges for progress
- Active step: cyan neon indicator bar (left border glow)
- Visited steps: dim green check, unvisited: dark outline
- Use shadcn `ScrollArea` for the nav
- Collapsed state: neon icon bar
- Logo at top with subtle glow

### 3.5 Step Content (`components/wizard/step-content.tsx`)
- Dark card container (`bg-cyber-dark`) with subtle neon border
- Phase badge: shadcn `Badge` with neon accent
- Heading: glow text
- Description: muted body text
- Cost/Time cards: neon-bordered shadcn `Card` with icon glow
- Navigation buttons: shadcn `Button` with neon styling

### 3.6 Checklist (`components/wizard/checklist.tsx`)
- shadcn `Checkbox` component with custom cyberpunk styling
- Completed items: neon green check with subtle green glow
- Item cards: dark border, hover = neon border glow
- Required indicator: neon red asterisk
- Links: neon blue with underline glow

### 3.7 Cost Card (`components/wizard/cost-card.tsx`)
- shadcn `Card` with dark background
- Icon with neon glow
- Value text in monospace with cyan color
- Subtle neon top-border accent

### 3.8 Resource Link (`components/wizard/resource-link.tsx`)
- Dark card style with neon border on hover
- Type icon with glow effect
- URL in monospace, neon blue

### 3.9 Chat Panel (`components/wizard/chat-panel.tsx`)
- Dark panel (`bg-cyber-darker`) with left neon magenta border
- Header: "⚒️ IRONFORGE MENTOR" in monospace, magenta glow
- Messages: 
  - User: neon cyan background (semi-transparent)
  - Assistant: dark surface with left magenta accent bar
- Streaming indicator: three pulsing neon dots
- Input: shadcn `Textarea` with neon border glow on focus
- Send button: shadcn `Button` with neon accent
- Suggested questions: dark bordered cards with hover glow

### 3.10 Summary Page (`app/wizard/summary/page.tsx`)
- Dark background with grid pattern
- Progress bar: neon gradient (cyan → green)
- Phase cards: dark with neon border accents
- Completed items: neon green, uncompleted: dim
- Print button: styled with neon outline

---

## Phase 4: Micro-Interactions & Polish

### 4.1 Custom Scrollbar (Dark)
- Dark track, neon thumb, glow on hover

### 4.2 Focus States
- All interactive elements: neon glow ring instead of default blue

### 4.3 Page Transitions
- Fade-in-up on route change for content areas

### 4.4 Hover Effects
- Cards: neon border glow intensifies
- Buttons: subtle pulse/breathe
- Links: underline glow animation

### 4.5 Loading States
- Cyberpunk-themed loading skeleton with neon pulse
- Replace "Loading..." text with animated "INITIALIZING..." or forge-themed message

---

## File Change Summary

| File | Action |
|------|--------|
| `package.json` | Add shadcn deps (auto via CLI) |
| `app/globals.css` | Complete rewrite — cyberpunk theme, effects, animations |
| `app/layout.tsx` | Dark body, font imports, scan-line overlay |
| `app/page.tsx` | Full redesign with cyberpunk hero, glitch logo, Tron grid |
| `app/wizard/layout.tsx` | Minor — dark loading state |
| `app/wizard/[phase]/[step]/page.tsx` | Update class names for dark theme |
| `app/wizard/summary/page.tsx` | Dark redesign with neon progress bars |
| `components/wizard/progress-sidebar.tsx` | Dark panel, neon indicators, shadcn ScrollArea |
| `components/wizard/step-content.tsx` | Dark cards, neon badges, shadcn components |
| `components/wizard/checklist.tsx` | shadcn Checkbox, neon styling |
| `components/wizard/cost-card.tsx` | shadcn Card, neon accents |
| `components/wizard/resource-link.tsx` | Dark card, neon hover |
| `components/wizard/chat-panel.tsx` | Dark panel, neon accents, shadcn inputs |
| `components/ui/matrix-rain.tsx` | **NEW** — Matrix digital rain background component |
| `components/ui/tron-grid.tsx` | **NEW** — Tron perspective grid background |
| `components/ui/*.tsx` | **NEW** — shadcn primitives (button, card, input, etc.) |
| `lib/utils.ts` | **NEW** — `cn()` utility for shadcn (clsx + tailwind-merge) |

---

## Files NOT Changed (Logic Preserved)
- `content/**` — All content data files unchanged
- `lib/types/**` — All TypeScript types unchanged
- `lib/store/**` — All localStorage logic unchanged
- `lib/ai/**` — System prompts unchanged
- `app/api/chat/route.ts` — API route unchanged
- `tsconfig.json` — No changes needed
- `next.config.ts` — No changes needed

---

## Implementation Order
1. Install shadcn/ui + dependencies (`clsx`, `tailwind-merge`, `class-variance-authority`)
2. Generate shadcn components (button, card, input, textarea, select, checkbox, badge, progress, scroll-area)
3. Rewrite `globals.css` with cyberpunk theme + all CSS effects
4. Update `layout.tsx` with fonts and dark base
5. Create `matrix-rain.tsx` and `tron-grid.tsx` effect components
6. Redesign landing page (`page.tsx`)
7. Redesign all wizard components (sidebar → content → checklist → cost-card → resource-link → chat)
8. Redesign summary page
9. Polish: scrollbar, focus states, hover effects, loading states
10. `npx tsc --noEmit` + `npm run build` — fix all errors
11. Visual QA in browser
