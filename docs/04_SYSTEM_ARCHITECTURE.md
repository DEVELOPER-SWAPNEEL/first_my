# Proposed system architecture and canonical payment model

All implementation choices here are defaults, not client-approved stack decisions.

## Architecture

Mobile-first TypeScript browser UI (candidate React) → same-origin TypeScript modular backend → candidate PostgreSQL. Modules: demo sessions/roles, merchants, requests, payments/provider, ledger, history/receipts and admin/reset. One deployable backend is enough for a solo prototype. Shared database is authoritative; frontend fixtures are restricted to UI-foundation milestone.

Provider boundary: `authorizeSimulation`, `reconcile`, `getStatus` with explicit mode and normalized results. Simulation writes no chain transaction. Ledger/state transitions remain owned by the payment service; a future adapter cannot bypass authorization, idempotency or mode separation. Testnet requires a revised lifecycle rather than assuming simulated ledger confirmation equals chain finality.

Use database-backed acknowledged work with a small in-process reconciliation loop on startup and periodically; reconcile one payment transactionally. No mandatory external queue/Redis/AWS/paid services. Polling views is simpler than realtime infrastructure; proposed two-second cadence is a demo default, not a latency promise. Run failure/delay scenarios from persisted data, so refresh/restart cannot lose the work. A backend unavailable means unknown/stale UI, never success.

Browser offers shareable demo URLs and rapid customer/merchant iteration with sample fallback. Camera permissions and device/browser behavior require validation. Native Expo/React Native could improve device integration and app-like experience but adds builds/distribution and native testing. Final platform choice remains provisional; prioritize browser for initial demonstration and revisit with actual device needs. Do not claim identical behavior or direct Framer export.

## Canonical payment states

| State | Meaning | Allowed next states |
| --- | --- | --- |
| `acknowledged` | Backend durably accepted authorized intent; no transfer yet | `confirmed`, `failed` |
| `confirmed` | Atomic simulated debit/credit and paid request committed | None |
| `failed` | Definitive rejection after acknowledgement; no transfer committed | None |

No payment row exists before acknowledgement. UI-only `submitting` means transport underway; UI-only `outcome_unknown` means response lost/disconnected. Neither is a server state or success. Preflight validation errors create no payment row. A failure after acknowledgement records a reason; retry is a new attempt after the old one is definitively terminal, not a state rollback.

Submission = sending intent. Acknowledgement = durable acceptance. Confirmation = completed simulated ledger transfer. Settlement = external movement/finality under a financial/provider model; **not applicable in simulation**. Store `mode=simulation`, `settlement_status=not_applicable`, and null chain fields. Receipt says “Simulated payment confirmed”, never “settled”. No `settled` payment state exists in this baseline.

## Request states

`open → paid | expired | cancelled`; paid, expired and cancelled are terminal. `paid` requires exactly one confirmed payment. Expiry is enforced by server time even if a stored open row has not yet been marked expired. Multiple attempts can exist after failures, but at most one acknowledged attempt per request at a time, and one confirmed ever. No partial payments. Confirmation rechecks expiry, cancellation, active generation and balance under locks. Two customers racing serialize; loser cannot spend against an already paid request.

## Transaction/recovery rules

Acceptance locks request, validates role/generation/expiry and active attempt, persists acknowledged payment and idempotency binding in one transaction. Reconciliation locks generation guard, request, payment and involved balances (consistent order), revalidates, then either commits balanced ledger entries, balances, `confirmed` and `paid` together or writes `failed` with no ledger effect. Unique constraints defend retries; only one reconciliation may win. Crash before commit rolls back; crash after commit is recovered by reading canonical state. Database transaction failure leaves acknowledgement for retry, not guessed failure.

Current simulation reserves no balance at acknowledgement. Two requests may be acknowledged against one balance; serialized confirmation makes the later unaffordable attempt fail. UI explains acknowledgement is not guaranteed completion. This is an explicit prototype tradeoff, not production reservation design.

Milestone 1 implementation note (13 October 2026): the browser frontend is React/TypeScript/Vite in apps/web, an implementation decision for the prototype. The backend/database/provider architecture above remains a target, not implemented behavior. Current navigation selects typed fixtures and never acknowledges or confirms a real payment.
