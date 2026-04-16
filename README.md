# KoinX — Tax Loss Harvesting

> Identify and act on tax-saving opportunities in your crypto portfolio — before your tax bill does.

[![Tests](https://img.shields.io/badge/tests-75%20passing-brightgreen)](#testing)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

---

## What is Tax Loss Harvesting?

Tax-loss harvesting is the practice of deliberately realising losses on crypto assets to offset capital gains, reducing your overall tax liability. This tool lets you:

- See your **pre-harvesting** capital gains in real time (short-term + long-term)
- **Select holdings** with unrealised losses to offset profits
- Instantly preview **after-harvesting** numbers and estimated tax savings with animated transitions
- Celebrate when savings cross $1,000 (confetti 🎉)
- Export a **harvest plan** as CSV or JSON for your accountant

---

## Features

| Feature | Detail |
|---|---|
| Live gains comparison | Side-by-side Pre / After Harvesting cards with animated number transitions |
| Holdings table | 25 assets, sortable by name / short-term gain / long-term gain |
| Granular selection | Per-row checkbox, select-all with indeterminate state |
| Savings estimate | Real-time calculation — confetti fires when savings ≥ $1,000 |
| Export | Copy as JSON to clipboard or download RFC-4180 CSV |
| Dark mode | System-aware toggle, persisted across sessions |
| Persisted selections | Chosen assets survive page refresh via `localStorage` |
| Full accessibility | Keyboard navigation, ARIA roles, focus trap in modal, `aria-sort` |
| Loading & error states | Shimmer skeletons, retry buttons, empty-state messaging |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | File-based routing, server components, API route handlers |
| Language | TypeScript 5 | Full type safety across the entire data pipeline |
| Styling | Tailwind CSS v4 | CSS-variable design tokens, runtime theme switching at zero cost |
| Testing | Vitest 4 + Testing Library | Fast ESM-native runner, unit + integration + component coverage |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Animation | Custom `requestAnimationFrame` | Zero-dependency animated counter + confetti |

---

## Project Structure

```
koinx-app/
├── app/
│   ├── api/
│   │   ├── capital-gains/route.ts   # GET /api/capital-gains
│   │   └── holdings/route.ts        # GET /api/holdings
│   ├── globals.css                  # Design tokens + Tailwind v4 @theme inline
│   ├── layout.tsx
│   └── page.tsx                     # Main page — orchestrates all state
│
├── components/
│   ├── GainsPanel/
│   │   ├── GainsCard.tsx            # Pre / After harvesting card with table
│   │   └── GainsPanel.tsx           # Two-column layout wrapper
│   ├── HoldingsTable/
│   │   ├── HoldingsRow.tsx          # Single asset row
│   │   └── HoldingsTable.tsx        # Sort, pagination, master checkbox
│   ├── HarvestPlan/
│   │   ├── HarvestPlanButton.tsx    # Trigger button with disabled tooltip
│   │   └── HarvestPlanModal.tsx     # Export modal (CSV / JSON)
│   ├── ui/
│   │   ├── AnimatedNumber.tsx       # RAF-based cubic ease-out counter
│   │   ├── AssetLogo.tsx            # Coin logo with fallback initials
│   │   ├── Checkbox.tsx             # Accessible checkbox w/ indeterminate
│   │   ├── Confetti.tsx             # Canvas savings celebration
│   │   └── Toast.tsx                # Non-blocking notification
│   └── states/
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       └── LoadingSkeleton.tsx      # Shimmer skeletons for GainsPanel + table
│
├── hooks/
│   ├── useCapitalGains.ts           # Fetches + unwraps { capitalGains } wrapper
│   ├── useHarvesting.ts             # Derives after-gains from selection (useMemo)
│   ├── useHoldings.ts               # Fetches + injects stable id per holding
│   ├── usePersistedState.ts         # SSR-safe localStorage-backed useState
│   └── useToast.ts
│
├── lib/
│   ├── calculations.ts              # Pure harvesting math — no side-effects
│   ├── exportHarvestPlan.ts         # RFC-4180 CSV + JSON serialisers
│   └── formatters.ts                # Currency, crypto, signed-gain formatters
│
├── data/
│   ├── mockCapitalGains.ts          # Seed capital gains data
│   └── mockHoldings.ts              # 25-holding dataset from assignment spec
│
└── types/index.ts                   # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (20 recommended)
- npm 9+

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd koinx-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload (webpack mode) |
| `npm run build` | Production build with TypeScript checking |
| `npm start` | Serve the production build |
| `npm test` | Run all 75 tests once |
| `npm run test:ui` | Open the Vitest interactive browser UI |

---

## Testing

The test suite has **75 tests across 5 test files**:

| File | Type | What it covers |
|---|---|---|
| `lib/calculations.test.ts` | Unit | Harvesting math — gains, losses, mixed, empty, idempotency |
| `lib/formatters.test.ts` | Unit | All 5 formatters: currency, percent, crypto, signed-gain, card-value |
| `lib/exportHarvestPlan.test.ts` | Unit | CSV RFC-4180 escaping, row counts, JSON schema, ISO timestamps |
| `lib/pipeline.integration.test.ts` | Integration | Full pipeline: raw API → id injection → selection → calculation → export |
| `components/HarvestPlan/HarvestPlanModal.test.tsx` | Component | Render, close button, Escape key, clipboard copy, CSV download |

```bash
npm test
```

---

## Data Model

### `GET /api/holdings`

Returns an array of raw holdings. The `useHoldings` hook injects a stable `id` (`${coin}-${index}`) client-side to handle duplicate coin symbols in the dataset.

```ts
interface Holding {
  id: string;           // generated: "${coin}-${index}"
  coin: string;         // "ETH"
  coinName: string;     // "Ethereum"
  logo: string;         // direct image URL
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: { balance: number; gain: number };  // short-term capital gain/loss
  ltcg: { balance: number; gain: number };  // long-term capital gain/loss
}
```

### `GET /api/capital-gains`

Returns `{ capitalGains: { stcg, ltcg } }`. The `useCapitalGains` hook unwraps the outer wrapper.

### Calculation Logic

```
For each selected holding h:
  h.stcg.gain >= 0  →  add to afterGains.stcg.profits
  h.stcg.gain < 0   →  add |gain| to afterGains.stcg.losses
  (same for ltcg)

afterTCG  = (stcg.profits − stcg.losses) + (ltcg.profits − ltcg.losses)
savings   = max(0, baseTCG − afterTCG)
```

---

## Design Tokens

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F4F6FA` | `#0A0E1A` |
| `--card` | `#FFFFFF` | `#0F1729` |
| `--border` | `#E5E9F2` | `#1F2A40` |
| `--text` | `#0F1629` | `#F3F4F6` |
| `--gain` | `#0FBA83` | same |
| `--loss` | `#E64646` | same |
| `--brand` | `#0052FE` | same |

Defined as CSS variables on `:root` / `[data-theme='dark']`, then registered into Tailwind v4's utility layer via `@theme inline` — so `text-gain`, `bg-brand`, `border-border` all respond to the dark-mode toggle at zero runtime cost.

---

## Architecture Highlights

### Vanilla pub-sub toast system

Instead of Zustand or Context, `lib/toastStore.ts` uses a module-level store with a `Set<Listener>`. Any module calls `toastStore.show()` without prop-drilling:

```ts
toastStore.show('Harvest plan copied', 'success');
```

### AnimatedNumber — no library

Smooth counter transitions use a single `requestAnimationFrame` loop with a cubic ease-out curve — no GSAP, no Framer Motion:

```ts
const eased = 1 - Math.pow(1 - t, 3);
display = prev + (target - prev) * eased;
```

### SSR-safe persisted selection

Selections survive page refresh without triggering React's hydration mismatch:

```ts
useEffect(() => {
  const stored = localStorage.getItem(key);
  if (stored !== null) setStateRaw(JSON.parse(stored));
}, []);
```

---

## Deployment

This project is deployed on **Netlify** via `netlify.toml`.

**Deploy your own copy:**

1. Push this repository to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Connect your repository — Netlify auto-detects Next.js
4. Click **Deploy** (no manual config needed — `netlify.toml` handles everything)

---

## Assumptions & Notes

- **Tax regulations** — Tax-loss harvesting is not permitted under current Indian tax law. This tool is for educational / analytical purposes. Always consult a qualified tax advisor.
- **Price data** — Values are sourced from CoinGecko. Exchange prices may differ slightly.
- **Mock data** — The app uses a static 25-holding dataset matching the assignment spec. In production this would call live portfolio and pricing APIs.
- **Amount to Sell** — Shows the full holding quantity, assuming a complete position exit for maximum loss realisation.
- **Duplicate coin symbols** — Two assets share the same symbol in the dataset. IDs are generated as `${coin}-${index}` to guarantee uniqueness across selections.
- **Short-term / Long-term split** — Some jurisdictions treat all gains as long-term. The `ltcg` bucket handles those; `stcg` will be zero.

---

## What I'd add with more time

- **Real-time prices** — WebSocket push from a price feed instead of static data
- **Playwright E2E tests** — Golden-path smoke test: select → harvest → export
- **Optimistic re-buy simulation** — Show projected post-rebuy cost basis
- **i18n** — Currency formatting already uses `Intl.NumberFormat`; locale switching is a small step
- **Portfolio import** — Connect to exchange APIs (Binance, Coinbase) via OAuth

---

Built for the KoinX Frontend Engineering Assignment.
