# Decision and assumption register

Baseline 13 October 2026. `Established` means explicitly specified by the current mission; `Proposed` means technical-lead default, not client approval; `Open` needs later choice/evidence. No earlier-discussion recommendations are treated as approved. Change entries with date, owner/evidence, rationale and affected documents; supersede rather than silently overwrite material choices.

| ID | Status | Decision / rationale | Affected docs |
| --- | --- | --- | --- |
| R01 | Established | Merchant payment prototype, simulation first; shared customer/merchant record; exclusions specified by user | 00–08, 12 |
| R02 | Established | Phase 1 prototype/technical validation; proposed ₹1,50,000 subject to agreement; target 50 merchants/200 customers is planning only | README, 00, 11 |
| R03 | Established | Cryptor visual reference adapted to payments; original implementation/licensed assets; no private project modification | 09 |
| R04 | Established | Milestone 0 documentation only; no apps/dependencies/services/deployment/blockchain/commits | AGENTS, 11 |
| P01 | Proposed | Mobile-first browser quickest initial route; TypeScript/React candidate; native Expo/React Native later candidate | 04, 11 |
| P02 | Proposed | Single modular TypeScript backend + PostgreSQL, polling and durable reconciliation; no mandatory infrastructure extras | 04, 07, 08 |
| P03 | Proposed | Internal DEMO units, scale 2; illustrative ₹100/DEMO; synthetic personas and seed balances | 00, 02, 03, 07 |
| P04 | Proposed | 10-minute single-use requests; expiry rechecked at confirmation; acknowledged/confirmed/failed model; no reservation | 03, 04, 07 |
| P05 | Proposed | Persona sessions for controlled demo; server roles/ownership; basic admin inspection/scenarios/reset only | 01, 06, 08 |
| P06 | Proposed | Immutable confirmed records; no refunds/reversals UI in baseline; print receipt convenience only | 01, 07 |
| O01 | Open | Final browser/native choice, exact frameworks/runtime and device matrix; validate camera/fallback in M1 | 04, 11 |
| O02 | Open | Final brand assets, typography license and copy approval; original text logo/system font usable meanwhile | 09, 11 |
| O03 | Open | Hosting/access gating and stronger auth if publicly shared; choose before exposing admin demo | 06, 11 |
| O04 | Open | Commercial scope/fee agreement; optional testnet budget/asset/network/wallet/provider | 00, 05, 11 |
| O05 | Open research | Current jurisdiction, regulation, tax, KYC/AML, custody and settlement specialist review before real-value pilot; no conclusions here | 00, 05, 06 |

No genuinely blocking missing information for Milestone 0 or fixture-based M1. Commercial approval is not inferred from documentation. Public access configuration and testnet scope must be resolved before those activities, not made blockers for simulation design.

## Inspection evidence

Workspace was empty except Git metadata on an unborn main branch; clean status and no tracked implementation. No applicable ancestor AGENTS.md found. Public reference content accessed 13 October 2026; private project loading failed. No private edits or pixel-level inspection claimed. No production capacity claims have been validated.

## Milestone 1 implementation decisions — 13 October 2026

Source: current user mission. These are prototype implementation choices, not client approval of production architecture. P01 and the frontend portion of O01 are superseded for this milestone; eventual native/production platform and physical-device matrix remain open. R04 remains a historical M0 boundary.

| ID | Status | Choice and rationale | Affected docs |
| --- | --- | --- | --- |
| I01 | Implemented | React + TypeScript + Vite in apps/web, npm lockfile, browser demo; fast local UI iteration with no backend/monorepo tooling | README, AGENTS, 04, 11, 13 |
| I02 | Implemented | Typed deterministic fixtures; exact BigInt helpers; explicit status chooser and confirmed-only Customer A receipt; no timers/canonical persistence | 01, 09, 13 |
| I03 | Implemented | React Router browser routes; /preview only in development; product navigation contains no fixture control panel | README, 13 |
| I04 | Implemented | Original system-font design and SVG wordmark/icons; qrcode.react for valid high-contrast fixture URL QR | 09, 13 |
| I05 | Implemented | Camera feature detection/user action, stop/unmount cleanup; no decoding. Browser request stayed pending and was stopped; physical capture/device testing remains open | 13 |
| I06 | Implemented | Custom merchant amounts are local draft previews; opaque draft ID cannot resolve through the sample catalogue. Browser history may retain drafts, never an issued request | README, 13 |
| I07 | Implemented | Vitest/Testing Library smoke checks; no lint stack yet. Updated test runner to current patched release after audit findings | 13 |

Milestone 1 authorizes local frontend execution and necessary open-source dependencies, not backend services, database, paid integrations, deployment or blockchain. Commercial agreement, public hosting/authentication and optional testnet decisions remain open.

## Milestone 1.1 decisions — 14 October 2026

| ID | Status | Choice and rationale | Affected docs |
| --- | --- | --- | --- |
| R05 | Established | User explicitly requested centered Cryptor composition and motion refinement before M2, while preserving all fixture/payment boundaries | README, AGENTS, 09, 11, 15 |
| I08 | Implemented | Original SVG/CSS emblem, medallions, light/orbit/product layers; reuse rights were not established for template assets | 14, 15 |
| I09 | Implemented | CSS/native Web Animations + IntersectionObserver; no new animation package or 3D library; present-only route effects avoid remounting camera/dialog content | 09, 15 |
| I10 | Implemented | System reduced-motion listener plus DEV-only override; continuous effects pause offscreen/document.hidden; no state transitions tied to animation | AGENTS, 09, 15 |
| I11 | Implemented | Readable mobile grid and independent FAQ answers; timings/hover treatment are our choices, not measured reference behavior | 09, 15 |

Earlier split-hero marketing composition is superseded. Existing runtime stack, typed fixture contracts, exact money and M2 backend proposals remain unchanged. No application dependencies, hosting, paid service or production approval added by this visual pass.
