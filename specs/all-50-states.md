# Spec: All 50 States for IronForge

## Problem
IronForge currently supports 2 states (WA, OR) with 5 hand-crafted content files each (~1,340 lines total). Scaling to 50 states with the current architecture would require 250 individual files — unmaintainable.

## Solution: Data-Driven Content Generation

### Architecture
Replace per-state content files with:
1. **State Registry** (`content/state-registry.ts`) — A single data source with all 50 states' regulatory data
2. **Content Generators** (`content/generators/*.ts`) — 5 generator functions that produce `Phase` objects from registry data
3. **Keep existing WA/OR** — Hand-crafted files remain as-is for their superior detail
4. **Dynamic routing** — `phases.ts` checks for hand-crafted content first, falls back to generated

### State Registry Data Structure
For each state:
```ts
{
  code: "CO",
  name: "Colorado",
  emoji: "🏔️",
  // Business Formation
  llcFilingFee: 50,
  llcFilingUrl: "https://...",
  annualReportFee: 10,
  annualReportName: "Periodic Report",
  sosUrl: "https://...",
  sosSearchUrl: "https://...",
  // Tax Info
  hasIncomeTax: true,
  incomeTaxRate: "Flat 4.4%",
  incomeTaxDetails: "...",
  hasSalesTax: true,
  salesTaxDetails: "...",
  taxAgency: "Colorado Department of Revenue",
  taxAgencyUrl: "https://...",
  taxRegistrationUrl: "https://...",
  // Contractor Licensing
  hasStateLicense: false,
  licensingAgency: "",
  licensingUrl: "",
  licensingFee: { min: 0, max: 0 },
  licensingNotes: "Local control — no state contractor license",
  examRequired: false,
  // Bonding
  stateBondRequired: false,
  stateBondAmount: "",
  bondNotes: "...",
  // Workers' Comp
  wcType: "competitive" | "monopolistic" | "private",
  wcAgency: "...",
  wcAgencyUrl: "...",
  wcNotes: "...",
  // Prevailing Wage
  hasStatePrevailingWage: false,
  prevailingWageAgency: "",
  prevailingWageUrl: "",
  prevailingWageThreshold: "",
  // Certifications
  stateCertProgram: "...",
  stateCertUrl: "...",
  stateCertCategories: "...",
  // Legal
  barAssociationUrl: "...",
  // Misc
  uniqueNotes: "...",
}
```

### Files to Create
| File | Purpose |
|------|---------|
| `content/state-registry.ts` | All 50 states data (~2000 lines) |
| `content/generators/business-formation.ts` | Generate business formation Phase from state data |
| `content/generators/contractor-license.ts` | Generate contractor licensing Phase from state data |
| `content/generators/bonding.ts` | Generate bonding Phase from state data |
| `content/generators/insurance.ts` | Generate insurance Phase from state data |
| `content/generators/certifications.ts` | Generate certifications Phase from state data |

### Files to Modify
| File | Change |
|------|--------|
| `content/phases.ts` | Add all state codes, use generators as fallback |
| `lib/types/wizard.ts` | Update `UserProfile.state` union type |
| `app/page.tsx` | Replace 2-card grid with searchable/scrollable state picker |

### Files NOT Changed
- `content/washington/*.ts` — kept as-is
- `content/oregon/*.ts` — kept as-is  
- `content/shared/*.ts` — kept as-is (bonding education, insurance education, federal certs, legal resources)
- All wizard components — no changes needed (they're already generic)
- API route — no changes
- Store/types (except state union) — no changes

### State Selection UI Redesign
The current 2-card grid won't work for 50 states. New design:
- Search input at top with neon glow
- Scrollable grid of state cards (responsive: 2-4 columns)
- Cards show: emoji + state name + abbreviation + key tax info
- Grouped by region with headers (optional — may keep flat for simplicity)
- Selected state highlighted with neon border

### Workers' Comp Classification
States fall into 3 categories:
- **Monopolistic** (must use state fund): OH, ND, WA, WY
- **Competitive State Fund** (state fund + private): CO, OR, UT, NM, + many others
- **Private Only** (no state fund): most states

### Contractor Licensing Classification
- **State License Required**: AZ, CA, FL, GA, HI, LA, MS, NV, NM, NC, OR, SC, TN, UT, VA, WV, AR, AL, CT, DE, RI, MI, MN, etc.
- **No State License (Local Control)**: CO, KS, MO, TX, WI, NY, etc.
- **Registration Required**: WA, IL, NJ, PA, etc.

### Validation Plan
1. `npx tsc --noEmit` — zero errors
2. `npm run build` — clean build
3. `npm run lint` — zero warnings
4. Dev server smoke test — verify state selection, wizard navigation works

### Implementation Order
1. Create state registry with all 50 states
2. Create 5 generator functions
3. Update phases.ts routing
4. Update types (state union)
5. Redesign landing page state picker
6. Delete partial CO/NM/WY/UT files that were started
7. Validate
