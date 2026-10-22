# Customer flows

## Core demonstration

1. Enter as Demo Customer A, acknowledge simulation disclosure, view 100.00 DEMO seed balance.
2. Demo Merchant A creates a 2.50 DEMO request. Customer scans its QR in another view/device. Sample-QR fallback resolves a real open fixture request from the backend; it is not a fake completed payment.
3. Resolve on server, then show merchant, 2.50 DEMO, expiry, and optionally “Illustrative ₹250.00 at ₹100 / DEMO; not live pricing or INR settlement.” Never trust QR-supplied amount/name.
4. Select “Authorize simulated payment”. Record the attempt idempotency key before sending. Submission changes only local presentation. Server acceptance returns a durable payment ID in `acknowledged`.
5. Status view polls the canonical payment. Only `confirmed` renders “Simulated payment confirmed”. Merchant view reflects the identical ID, amount and state.
6. Open simulated receipt; wallet is now 97.50 DEMO and merchant demo balance 2.50 DEMO. No blockchain hash or explorer link exists.

## Recovery and alternatives

| Situation | Required behavior |
| --- | --- |
| Camera denied/unavailable | Explain permission; sample QR and paste approved-origin link remain usable |
| Bad/unsupported QR, missing request or old reset generation | Reject before authorization; return to scan |
| Request expired/cancelled/paid | Explain state; no new authorization; original payer may open own existing payment |
| Insufficient balance | Show exact available/required units; no debit; can revisit wallet or request |
| Double tap/retry | Reuse key; show existing payment; no second transfer |
| Refresh while sending | Restore key and resolve authenticated attempt endpoint before any new attempt |
| Timeout/offline after submission | Show “Outcome not yet known”; no failure/success inference; query attempt/payment on reconnect |
| Durable acknowledged payment | Resume polling after refresh; backend recovery completes independently of browser |
| Definitive failed payment | Show reason; fresh attempt/key allowed only if request still open and failure terminal |
| Authorization cancelled before submission | Back to review/scan; no payment created |
| Session expired | Re-enter same demo persona; resume owned payment; do not change payer silently |

No offline authorization. History includes acknowledged, confirmed and failed attempts; receipt success only for confirmed. Failure/reset scenarios and authoritative transitions are defined in docs/04_SYSTEM_ARCHITECTURE.md. No refund action in baseline; docs/07_DATABASE_DESIGN.md distinguishes future refunds from mutation/reversal.
