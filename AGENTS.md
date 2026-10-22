# Engineering instructions

## Read before work

Read README.md, docs/00_PRODUCT_VISION.md, docs/01_PROTOTYPE_SCOPE.md and docs/10_DECISIONS.md first. For payment changes read docs/02_USER_FLOWS.md through docs/08_API_DESIGN.md and docs/12_DEMO_ACCEPTANCE_CRITERIA.md. For UI work also read docs/09_UI_DESIGN_SYSTEM.md; use docs/11_ROADMAP.md to stay within the active milestone.

## Boundaries

- Merchant payments only. No trading, investments, staking, DeFi, NFTs, tokenomics, custom coins or custom blockchain.
- Simulation first. Initial demo has no blockchain dependency, real money, mainnet, production custody/private keys, fiat conversion, bank settlement or withdrawals.
- No production KYC/AML integration or identity-document collection. Use synthetic identities and visibly labelled demo assets.
- No claims of legal approval, audited security, guaranteed zero fees/errors, or instant final settlement. Do not repeat historical UPI-fee, tax, regulation or software-capability claims as verified facts. Record research questions; these do not block simulation.
- Never equate submission or acknowledgement with confirmation. Follow the states and transitions in docs/04_SYSTEM_ARCHITECTURE.md. Simulation has no settlement; no invented chain hashes/explorer links.
- Use integer minor units/exact decimal handling, idempotency, atomic ledger transfers, server-side authorization and shared canonical records. Preserve invariants in docs/07_DATABASE_DESIGN.md.
- Testnet requires separately agreed scope and safety criteria. Do not silently turn simulation into a chain transfer.
- Use original implementation and licensed assets. Cryptor is a reference; do not assume Framer source export or reuse rights. Do not modify the private Framer project without instruction.

## Workflow and decisions

Inspect Git status and existing implementation before changes; preserve unrelated work. Requirements, proposed defaults and unresolved decisions are distinct. Earlier suggestions are not client approval. Record changes in docs/10_DECISIONS.md with date, status, rationale and affected documents; update those documents in the same change. Resolve conflicting terminology using the canonical state model, and record the correction. Do not claim implemented behavior until verified.

Preferred provisional direction: TypeScript, mobile-first browser, modular backend, candidate PostgreSQL and replaceable payment-provider boundary. Expo/React Native is a later native candidate. AWS, Redis, queues and paid services are not mandatory.

Milestone 0 is complete. The user explicitly authorized Milestone 1 frontend scaffolding, open-source dependencies, local execution and UI verification on 13 October 2026. Milestone 1 implements fixtures only in apps/web; stop before backend/payment/database/blockchain work. Subsequent milestones require a new mission. Paid services, deployment and Framer modifications remain unauthorized. Do not create commits unless requested. Use focused verification for affected contracts; exercise concurrency, retries and interrupted connections for payment changes. Keep simulation indicators and failure states accessible, including reduced motion and camera fallback.

## Frontend conventions — Milestone 1

React + TypeScript + Vite in apps/web; simple npm package, no monorepo infrastructure. Read docs/13_MILESTONE_1_VERIFICATION.md before extending the UI. Use src/fixtures for typed synthetic DTOs and exact money/link helpers; src/components for reusable UI; src/pages for surfaces. No payment logic, API service, canonical session or balance persistence in components. UI preview query parameters choose static states, never transfer outcomes. Merchant form drafts may live in browser navigation state, but are not issued requests.

Development-only /preview is separate from product navigation and absent from the production route table. Authorization opens an explicit fixture chooser; only confirmed Customer A fixture exposes a receipt. Do not add automatic progression. Camera preview is not a QR decoder; release tracks on stop/unmount, including late permission resolution. Keep QR version/generation/opaque ID validation and local-origin allowlist.

Use npm --prefix apps/web run check, test and build for relevant changes. No lint configuration exists yet. Preserve original wordmark, system fonts, fixture disclosures, native-dialog focus restoration, reduced-motion CSS and 44px targets. Evidence-based limitations belong in docs/13; update decisions and roadmap when connecting Milestone 2 APIs.

## Milestone 1.1 — visual refinement completed 14 October 2026

The current mission authorized local visual/motion refinement of the existing UI only. Read docs/14_VISUAL_ASSETS.md and docs/15_MILESTONE_1_1_VERIFICATION.md before changing visuals. Marketing uses original assets in src/assets/visuals and reusable Motion/PaymentVisuals/MarketingNav/FAQ components. CSS timing is our implementation choice, not verified template timing. No new animation package or template assets were added.

Preserve the fixture layer and operation boundaries. Motion must never drive payment state, update balances, fabricate success, delay operational focus, or animate acknowledgement into confirmation. Use present-only PageMotion without remounting route content; use AmbientRegion for continuous effects; honor system reduced motion and pause offscreen/background. Shared symbol markup comes only from our local authored SVG, never user or remote input. Duplicate decorative ribbon content remains aria-hidden with no tab stops. Development motion override stays off production surfaces.

M2 has not started. Keep the user's already-running preview available for inspection; do not shut it down after checks unless requested. Do not launch duplicate dev servers on occupied strict ports.
