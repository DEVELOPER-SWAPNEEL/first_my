# Milestone 1 — implementation and verification

Completed 13 October 2026 in `/Users/john/Documents/ChatGPT/VARTAMAN`. Scope: runnable frontend and UI fixtures only. The original uncommitted M0 documentation was preserved and updated; no commits created. No backend, database migrations, canonical sessions/payments, blockchain, admin screens, paid services, deployment or Framer edits.

## Implementation and local commands

React 19.3, TypeScript 5.9.3, Vite 7.3.7, React Router 7.18.4, qrcode.react 4.2.0. Test tooling: Vitest 5.0.4, Testing Library, jsdom. Versions are locked in apps/web/package-lock.json; Node 24.13.0 / npm 11.6.2 used for verification. Only frontend/runtime and focused test dependencies installed; no lint tool configured.

From repository root:

```sh
npm --prefix apps/web ci
npm --prefix apps/web run dev
# http://127.0.0.1:5173/ — Ctrl+C stops the loopback-only server
npm --prefix apps/web run check
npm --prefix apps/web run test
npm --prefix apps/web run build
npm --prefix apps/web run preview -- --port 4173
# http://127.0.0.1:4173/ — production build preview
```

Source: apps/web/src/App.tsx owns routing and in-memory persona selection; fixtures/model.ts owns typed deterministic scenarios; fixtures/money.ts exact BigInt arithmetic; fixtures/links.ts strict local QR/paste shape; components/ui.tsx shared primitives/dialog/QR; components/Status.tsx payment-state presentation; pages own customer, merchant, marketing and development gallery surfaces. styles.css owns design tokens, responsive rules, focus, reduced motion and print styling. No API requests or simulated transfer logic are implemented.

## Routes

| Routes | Implemented surface |
| --- | --- |
| `/` | Original marketing hero, wallet/QR preview, features, four steps, merchant benefits, FAQ, CTA/footer |
| `/customer` | Persona A/B, disclosure-gated entry; no actual session/authentication |
| `/customer/wallet` | Balance, sample/scan entry and recent activity |
| `/customer/scan` | User-triggered camera preview feasibility, sample and strict paste fallback |
| `/customer/review` | Merchant, exact amount, indicative INR, available balance, illustrative expiry; status chooser |
| `/customer/status` | Explicitly chosen submission/acknowledged/unknown/confirmed/failed presentation; no automatic progression |
| `/customer/history`, `/customer/payment` | Fixture history, filters and detail |
| `/customer/receipt` | Confirmed Customer A fixture only; labelled simulated receipt and print action |
| `/merchant` | Synthetic merchant disclosure entry |
| `/merchant/dashboard` | Confirmed-only fixture totals, request and corresponding payment |
| `/merchant/request/new` | Exact positive amount validation and local design draft |
| `/merchant/request` | QR/link, amount, illustrative INR/status, copy fallback and cancellation-preview dialog |
| `/merchant/history`, `/merchant/payment` | Corresponding fixture history/detail, payer shown on merchant rows |
| `/preview` | Development-only fixture gallery and edge-case links; absent from production routing |

Product navigation deliberately has no developer state controls. Authorization opens “Choose a status preview”; selecting an outcome changes navigation, never transfers units. The status page permits another explicit preview selection. No animation advances submission into success. Receipt and status are guarded against Customer B inheriting A's payment fixture.

## Fixture catalogue

Use `/preview` in development, or explicit `?scenario=...` on a surface. Each app view visibly says UI preview and simulation/no real money.

| Scenario | Customer A / B / merchant | Record and presentation |
| --- | --- | --- |
| initial | 100.00 / 1.00 / 0.00 DEMO | Open 2.50 DEMO sample; no payment |
| submitting | 100.00 / 1.00 / 0.00 | UI-only sending presentation; no durable record |
| acknowledged | 100.00 / 1.00 / 0.00 | pay_fixture_01 acknowledged; no success receipt |
| confirmed | 97.50 / 1.00 / 2.50 | Customer A payment confirmed and request paid; corresponding merchant row/receipt |
| failed | 100.00 / 1.00 / 0.00 | Definitive declined attempt; unchanged balances; no receipt |
| unknown | 100.00 / 1.00 / 0.00 | Outcome not yet known; no success/failure inference |
| stale | 100.00 / 1.00 / 0.00 | Explicit stale notice and unavailable current status |
| loading / empty | presentation fixtures | Skeletons/empty panels; no request/payment processing |

Customer B's own history never shows Customer A's payment. Gallery also links insufficient funds and expired/cancelled/paid request-review guards. Fixed fixture timestamp: 13 Oct 2026, 14:30 IST. Fixed indicative rate: ₹100/DEMO, so sample 2.50 DEMO displays illustrative ₹250.00. Integer unit strings and BigInt calculations only.

Merchant form values create local presentation drafts, not records. Browser navigation state may retain a draft across Back/refresh, but no balances/payment records are stored as canonical data. Custom draft IDs have no sample resolver; UI says so. Cancellation changes only the mounted presentation and removes its QR. It cannot affect another view. There is no live expiry countdown, reset service, polling or authoritative merchant synchronization.

## Checks performed and evidence

| Check | Result / limits |
| --- | --- |
| TypeScript | `npm --prefix apps/web run check` passed |
| Production build | `npm --prefix apps/web run build` passed; ignored dist output generated |
| UI smoke tests | 12 passed: entry/persona/disclosure, explicit authorization chooser, acknowledgement without receipt, five nonconfirmed receipt guards, confirmed receipt, exact amount/custom draft, external-link rejection, late camera stream cleanup and exact money/link contracts |
| Dependencies | Final `npm audit` reported zero known vulnerabilities. Initial test-runner findings resolved by upgrading Vitest; not a security audit of the product |
| Local execution | Vite dev and production preview served successfully; dev root HTTP 200 |
| Production gallery exclusion | Browser visited production `/preview`; displayed “Page unavailable”, no fixture gallery |
| Responsive DOM checks | 12 representative routes × 360/390/768/1440 = 48 checks, no document-level horizontal overflow; results in evidence/milestone-1/responsive-checks.json |
| Visual inspection | Public Cryptor hero, original full marketing page, 360px wallet, 390px review/unknown/receipt/dialog, 768px merchant dashboard and 1440px QR presentation inspected. Key screenshots below |
| Browser interaction checks | Marketing→entry→wallet; disclosure gate; FAQ expansion; excess-precision error; sample amount→QR; cancellation dialog; external paste rejection and valid local sample→review; explicit status chooser→acknowledged without receipt |
| Keyboard/focus | Native dialog was modal, focused Close on opening; Escape closed it and restored authorization-button focus. Logical h1 fallback implemented when a trigger is removed. CSS visible focus; no complete screen-reader audit |
| Contrast | Seven representative text/surface token combinations calculated ≥4.5:1 (range 5.70–16.54); evidence/milestone-1/contrast-checks.json. Gradient/hover/all screen combinations not exhaustively audited |
| Reduced motion | CSS override inspected: disables animation/transitions/hover transform under prefers-reduced-motion. No OS preference change or physical-device reduced-motion test performed |
| Lint | Not configured; no lint pass claimed |

Visual corrections: compact DEMO labels given a 10px minimum; merchant payment rows now identify the customer; cancellation dialogs restore focus to a logical heading if the invoking button disappears.

Saved screenshots (browser viewport widths include the scrollbar):

- [Marketing hero, 1440px](evidence/milestone-1/marketing-hero-1440.jpg) and [full marketing page](evidence/milestone-1/marketing-1440.jpg).
- [Wallet, 360px](evidence/milestone-1/wallet-360.jpg).
- [Review, 390px](evidence/milestone-1/customer-review-390.jpg), [unknown outcome](evidence/milestone-1/unknown-outcome-390.jpg), [receipt](evidence/milestone-1/receipt-390.jpg).
- [Merchant dashboard, 768px](evidence/milestone-1/merchant-dashboard-768.jpg) and [QR presentation, 1440px](evidence/milestone-1/merchant-request-1440.jpg).

## Camera and QR limits

Available in-app browser reported a secure context and getUserMedia. The explicit Enable action reached “Requesting camera access…”; no successful capture or definitive denial was observed. The request was stopped before leaving. Code stops tracks on Stop/unmount and immediately stops a stream that resolves after the user leaves; the late-resolution case is covered by a mocked smoke test. Successful physical capture and actual track release on a real device are unverified.

Localhost/loopback can be a secure context in supported browsers; a non-loopback origin generally requires HTTPS for media access. A phone's localhost is that phone; this loopback-only server is not a phone-accessible deployment. Physical Safari/Chrome permission prompts, rear-camera selection, capture lifecycle and QR scanning need later testing. Browser viewport emulation is layout evidence, not device compatibility.

QR is real encoded black/white SVG with a four-module quiet zone. Payload is local origin + `/customer/scan?v=1&generation=fixture-1&request=req_sample_01`; contains no trusted amount/name/address/credential. Paste rejects foreign origins, wrong path/version/generation, unknown IDs, extra/duplicate parameters and fragments. Only the catalogue sample resolves. No decoding library, server request resolution, chain hash or explorer link exists. Private Framer edits were not inspected or modified.

## Precise Milestone 2 handoff

1. Read docs/04–08 and inspect current source/Git state. Establish API DTO/adapters to replace fixture sourcing, while retaining /preview for development.
2. Implement the modular backend/candidate database and scoped synthetic sessions; issue immutable amount-specific requests with server expiry and real QR resolution.
3. Add durable idempotent acknowledgement and reconciliation; atomically confirm debit/credit/request/payment together using exact units. Preserve acknowledgement/confirmation/settlement distinctions and duplicate/overspending/generation invariants.
4. Replace preview authorization with the shared simulated journey, reconnect recovery and customer/merchant polling against one canonical record. Keep simulation/illustrative labels and confirmed-only receipts.
5. Add real QR decoding and test camera/permission/lifecycle on target physical devices; validate request links on server as well as client. Verify retry/race/interruption contracts with focused payment tests.

Polished admin remains M3. Testnet, real funds, production authentication/custody, deployment and paid services remain outside this mission. Stop at the completed Milestone 1 boundary.

## Revalidation — 14 October 2026

The repeated Milestone 1 mission was checked against the existing implementation; no replacement scaffolding or application changes were needed. Git still contains the uncommitted context pack/frontend; no ancestor instructions added requirements. TypeScript, all 12 smoke tests and production build passed again. The local Vite frontend was started and marketing visually rechecked; browser authorization → explicit acknowledged preview displayed acknowledgement with zero receipt links. [Fresh marketing screenshot](evidence/milestone-1/marketing-recheck-2026-10-14.jpg). The verification server was stopped afterward.

The 48 responsive checks and camera observations above were performed on 13 October and were not repeated or upgraded into physical-device claims today. No lint configuration exists. Milestone 1 remains complete; Milestone 2 was not started.
