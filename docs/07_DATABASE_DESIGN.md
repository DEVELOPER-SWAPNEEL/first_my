# Proposed database design and invariants

Candidate PostgreSQL; logical schema to guide later migrations, not implemented SQL.

| Entity | Required fields / constraints |
| --- | --- |
| demo_generation | singleton generation, fixture_version; shared/exclusive transaction guard for normal operations/reset |
| users / sessions | synthetic label, role, merchant binding; generation, expiry; scoped opaque session token |
| merchants | ID, synthetic display name, owner, generation |
| assets | code `DEMO`, scale 2, mode simulation; no network/contract |
| balances | owner/account, asset, integer units, generation; unique owner+asset+generation; nonnegative |
| payment_requests | ID, merchant, asset, positive amount_units, state, created_at, expires_at, generation; immutable amount; confirmed_payment_id unique when paid |
| payments | ID, request, payer, merchant, amount/asset/name snapshot, state, reason, mode, settlement_status, generation, acknowledgement/confirmation/failure timestamps, scenario; null chain hash/network |
| ledger_entries | ID, payment, account, signed integer delta, generation, timestamp; unique payment+account; exactly one customer debit and merchant credit per confirmation |
| idempotency_records | principal, operation, key, generation, canonical body digest, result/payment ID; unique principal+operation+key+generation |
| illustrative_rates | fixture version, asset, INR minor units per asset unit, label; payment stores rate/value snapshot if shown |
| audit_events | reset/state event, actor, correlation ID, generation, timestamp; reset audit retained across fixture clearing |

Store units as BIGINT within a proposed maximum of 1,000,000.00 DEMO per amount/balance; enforce aggregate overflow bounds. API uses integer strings; TypeScript calculations use BigInt or exact decimal library, never Number arithmetic for money. Parse decimal input strictly (maximum two places), rejecting extra precision rather than silently rounding. Scale never changes for an issued request.

Illustrative example: 2.50 DEMO = 250 units. Fixed rate ₹100 / DEMO = 10,000 paise per DEMO. INR paise = amount_units × rate_paise / 100; integer calculation. For later non-integral results, define and label a single display rounding rule (proposed half-up to paise); payable DEMO units never change. Snapshot displayed rate/INR on payment so receipts do not drift.

## Invariants and transaction boundaries

- Acceptance transaction persists acknowledged intent and idempotency binding together; validation errors have no balance effect. At most one acknowledged attempt per request (partial unique constraint); one confirmed per request (partial unique constraint).
- Confirmation transaction locks generation/request/payment/balances, verifies open/unexpired request, then inserts two balanced ledger entries, updates exact balances, marks request paid and payment confirmed atomically. Total delta is zero; balances never negative. Failed/acknowledged payments have zero ledger entries.
- Lock accounts in stable ID order; keep transactions short. Conditional writes and database uniqueness back up application checks. A losing race reads the canonical outcome or returns a structured conflict, never repeats debit.
- Treat expiry at transfer time using database clock after acquiring locks; request validity is not extended by acknowledgement. Confirmation before expiry survives later expiry. Cancellation is allowed only while open and serializes against confirmation.
- Customer history and merchant history select the same payment entity with ownership filters. Receipts are derived views of immutable confirmed snapshots, not independent mutable records.
- Durable acknowledged rows are reconciliation work; loop retries after restart. Provider failure commits `failed`; transient infrastructure failure rolls back and leaves acknowledged for reconciliation.
- Keep idempotency records for the entire demo generation. Reset atomically clears fixture records and increments generation. Every write checks generation; old work cannot enter the new seed. Keep reset audit separately.

## Refund versus reversal

No baseline refund or reversal UI/API. A future refund is a distinct authorized compensating transfer linked to a confirmed original, with its own amount/state/idempotency and cumulative refundable limit. Original stays confirmed; history shows both. A reversal/correction of an original accounting event has different rules and authority and is not achieved by rewriting a confirmed payment to failed or deleting its ledger entries. Demo reset clears a whole fixture generation and must never be presented as a refund/reversal.
