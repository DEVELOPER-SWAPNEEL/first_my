# VARTAMAN

## Vartaman Payment Prototype — Product Definition v1

Milestone 0 documentation baseline, 13 October 2026. This repository defines a client-facing merchant-payment prototype. Milestone 1 now includes a runnable fixture-only frontend in apps/web; no payment backend is implemented. Workspace inspection found only `.git`, a clean unborn `main` branch, no tracked files, and no applicable ancestor AGENTS.md. Existing work was not replaced.

Customer journey: open → scan merchant QR → review merchant and amount → authorize simulated payment → view status and receipt. The merchant sees the same payment record.

The eventual 50-merchant / 200-customer pilot is a planning target, not existing adoption or tested capacity. Proposed Phase 1 price: ₹1,50,000, subject to agreement, for product prototyping and technical validation, not a production financial platform. A later testnet experiment requires separate scope.

## Read the context pack

| Document | Owns |
| --- | --- |
| [00 Product vision](docs/00_PRODUCT_VISION.md) | Product Definition v1, requirements and assumptions |
| [01 Scope](docs/01_PROTOTYPE_SCOPE.md) | Phase 1 boundaries and screen inventory |
| [02 Customer flows](docs/02_USER_FLOWS.md) | Customer journey and recovery |
| [03 Merchant flows](docs/03_MERCHANT_FLOWS.md) | Requests, dashboard and reconciliation |
| [04 Architecture](docs/04_SYSTEM_ARCHITECTURE.md) | Proposed stack, canonical payment state and transitions |
| [05 Blockchain strategy](docs/05_BLOCKCHAIN_STRATEGY.md) | Simulation versus optional testnet |
| [06 Security](docs/06_SECURITY_MODEL.md) | Prototype controls and limits |
| [07 Database](docs/07_DATABASE_DESIGN.md) | Exact amounts, transactions and invariants |
| [08 API](docs/08_API_DESIGN.md) | Contracts, idempotency and error handling |
| [09 Design system](docs/09_UI_DESIGN_SYSTEM.md) | Visual direction, reference mapping and copy |
| [10 Decisions](docs/10_DECISIONS.md) | Requirement/default/open-decision register |
| [11 Roadmap](docs/11_ROADMAP.md) | Milestone deliverables and completion gates |
| [12 Acceptance](docs/12_DEMO_ACCEPTANCE_CRITERIA.md) | Demonstration and failure verification |
| [13 Milestone 1 verification](docs/13_MILESTONE_1_VERIFICATION.md) | Routes, UI checks, evidence and limitations |
| [14 Visual assets](docs/14_VISUAL_ASSETS.md) | Original SVG/CSS provenance and reuse |
| [15 Milestone 1.1 verification](docs/15_MILESTONE_1_1_VERIFICATION.md) | Centered visual remix, motion and evidence |

Read [AGENTS.md](AGENTS.md) before development. React/TypeScript/Vite and browser delivery are implementation decisions for this prototype, not approval of an eventual production stack. Backend architecture remains proposed. No deployment, blockchain work or commits were created.

## Run locally

From the repository root, with Node.js 24 (verified with 24.13.0) and npm:

```sh
npm --prefix apps/web ci
npm --prefix apps/web run dev
```

Open http://127.0.0.1:5173/ (loopback only; strict port). Stop with Ctrl+C. If the port is occupied, stop its known owner rather than killing an unrelated process.

```sh
npm --prefix apps/web run check
npm --prefix apps/web run test
npm --prefix apps/web run build
npm --prefix apps/web run preview -- --port 4173
```

Build output is apps/web/dist. Production preview is http://127.0.0.1:4173/. No lint configuration is installed.

## Routes and fixture behavior

- `/`: marketing presentation, FAQ and role entries.
- `/customer`: disclosure/persona entry; `/customer/wallet`, `/customer/scan`, `/customer/review`, `/customer/status`, `/customer/history`, `/customer/payment`, `/customer/receipt`.
- `/merchant`: entry; `/merchant/dashboard`, `/merchant/request/new`, `/merchant/request`, `/merchant/history`, `/merchant/payment`.
- `/preview`: development-only gallery, isolated from product navigation. Covers loading, empty, initial, submitting, acknowledged, confirmed, failed, stale and unknown.

`?scenario=confirmed` explicitly selects the confirmed fixture; other scenarios are listed in the gallery. It does not execute a payment. Receipt requires that fixture and Customer A. Persona selection is in-memory navigation, not authentication; balances/payment records are static, not persisted. Form drafts are design previews only and may be retained by browser history. Custom draft QR IDs cannot be resolved by the sample catalogue.

QR payload: local-origin `/customer/scan?v=1&generation=fixture-1&request=req_sample_01`. Paste validation resolves only the sample fixture, not a server request. Camera feature detection/action is implemented; decoding is deferred. Localhost/loopback is treated as a secure context in supported browsers; other origins generally need HTTPS. A phone’s localhost points to the phone, not this machine. Physical-device capture/scanning is unverified.

Milestones 1 and 1.1 are complete within the fixture-only boundary. The landing page now uses centered Cryptor-inspired composition, original luminous SVG/CSS visuals and a shared motion system. See docs/15 for before/after and sampled motion evidence. System reduced motion is honored; /preview offers a development-only reduced-motion inspection override. Next mission: connect the modular backend/shared simulation in Milestone 2; see the precise handoff in docs/13. Native delivery and production choices remain open.
