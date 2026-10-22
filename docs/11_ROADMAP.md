# Staged roadmap

No fixed delivery date or production readiness promise. Milestones are completion gates, not elapsed-time estimates. Milestone 0 ends with documentation; subsequent implementation requires a new mission.

| Milestone | Concrete deliverables | Completion criteria |
| --- | --- | --- |
| 0 — Definition and context pack | README, AGENTS and docs 00–12; screen inventory, state/API/data contracts, reference mapping, decisions | Files exist, local links resolve, terminology/scope checked, provisional choices clear; no application work |
| 1 — Design and UI foundation | Original tokens/components; marketing sections; customer onboarding/wallet/scan/review/status/history/receipt shells; merchant entry/dashboard/request/QR/detail shells; static synthetic fixtures | Screen contracts demonstrated at mobile/desktop; keyboard/contrast/reduced-motion checked; clear simulation/illustrative labels; camera/fallback feasibility checked on target browser; record platform decision before integration |
| 2 — Shared simulated journey | Modular backend, database schema/seeds, scoped demo sessions, request QR resolution, idempotent acceptance, reconciliation/atomic ledger, customer and merchant polling | Real shared request → review → acknowledgement → confirmation → both views; exact balanced amounts; double submission and competing payment checks pass; browser restart/reconnect recovers |
| 3 — History/admin/failure handling | Canonical histories/receipt, admin inspection/scenario/reset UI, expiry/cancellation/errors/stale states; generation isolation | Failed/expired/duplicate/insufficient cases verified; reset predictable; old QR/jobs invalid; ownership enforced; no false success, refunds or settlement claims |
| 4 — Demo verification/presentation | Acceptance evidence, demo script, reset instructions, environment/start instructions, known-limits sheet and presentation previews | All docs/12 checks pass with evidence; clean normal and failure rehearsal; same record in two views; claims/assets reviewed; client-facing limits visible |
| Optional later — Testnet validation | Separately agreed experiment design, selected test network/asset/provider, isolated adapter/environment and chain evidence report | Scope/budget agreed, authentic testnet results and failure/finality behavior documented; no mainnet/real-value claim; architecture/state docs revised before implementation |

Admin endpoint/control basics can precede polished admin screens for reliable seed/reset use; polished screen delivery remains M3. M1 fixtures are not evidence of functional payment processing. Update README with actual run/test commands once an implementation exists.

## Handoff to Milestone 1

Read AGENTS and docs 00/01/09/10/11. Confirm current Git state and preserve this pack. Use provisional browser route, original wordmark/system fonts and synthetic DEMO fixtures. Build accessible marketing/customer/merchant components and screen shells with all state variants. Record framework/platform/device assumptions before scaffolding in that new mission. Do not introduce blockchain, real balances, fabricated price feeds or final-success-on-submit. Shared payment implementation begins M2.

## Evidence-based status — 13 October 2026

M0 complete. M1 complete within the fixture-only UI scope: runnable React/TypeScript/Vite frontend, original marketing/customer/merchant foundations, explicit fixture states, QR/paste/camera foundation and documented local checks. Type checking, build, UI smoke tests and browser route/width/interactions were performed; details/evidence in docs/13. Physical-phone compatibility, successful camera capture, real decoding, server sessions and authoritative payment behavior are not proven or implemented. M2–4 and optional testnet are not started.

The earlier “Handoff to Milestone 1” is historical. Next mission is M2: define API-backed adapters, implement shared request/payment state and exact ledger invariants from docs/04–08, then connect customer/merchant views and real QR resolution. Preserve M1 fixture gallery for UI inspection. No production-readiness claim follows from this milestone.

## Milestone 1.1 — completed 14 October 2026

User-requested intermediate gate before M2: centered Cryptor-inspired landing composition, original reusable visual assets and shared motion on marketing/customer/merchant surfaces. Deliverables and evidence in docs/14–15. TypeScript/tests/build pass, responsive routes inspected, reduced-motion/offscreen-pause paths checked, and short sampled motion captured. Existing fixture journeys remain usable. Physical-device/complete-loop/performance certification is not claimed. M2 remains unstarted; use the M2 handoff from docs/13 and preserve motion boundaries in docs/15.
