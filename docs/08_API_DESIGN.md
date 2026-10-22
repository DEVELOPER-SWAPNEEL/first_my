# Proposed API contracts

Versioned same-origin JSON API `/api/v1`. Server session determines principal/role; do not trust body payer/merchant ownership. All responses identify `mode: simulation` and `generation`. Amount units are base-10 integer strings; timestamps UTC ISO strings; IDs opaque and scoped. No floating-point payable values.

| Endpoint | Contract |
| --- | --- |
| POST /demo/session | Select allowlisted synthetic persona; return session/role; admin entry gated for controlled demo |
| GET /me/wallet | Scoped DEMO balance, asset scale, labelled illustrative rate |
| POST /merchant/requests | Merchant role; amount_units, asset; server expiry; Idempotency-Key; returns request + QR payload |
| GET /requests/:id | Authenticated customer or owning merchant; minimal merchant/amount/state/expiry; no private data |
| POST /merchant/requests/:id/cancel | Owner; Idempotency-Key; cancel open request or conflict if paid |
| POST /payments | Customer; request_id, expected_amount_units, asset, expected_generation; Idempotency-Key; server revalidates and returns durable acknowledged payment, HTTP 202 |
| GET /payment-attempts/:key | Same customer + payment operation/generation; resolve key to existing payment or not-found; recovery after lost response |
| GET /payments/:id | Payer, owning merchant or admin; canonical status/snapshot and reason |
| GET /payments/:id/receipt | Same scope; confirmed-only simulated receipt; nonconfirmed returns NOT_CONFIRMED |
| GET /me/payments | Customer history, cursor and status filters |
| GET /merchant/payments | Owned payments/confirmed totals, cursor; polling source |
| GET /merchant/requests | Owned requests; supports dashboard/sample resolution |
| GET /demo/sample-request | Returns current-generation active sample request; if unavailable explains need for merchant/admin reset, never creates a fake outcome |
| GET /admin/overview | Admin; paginated synthetic entities/payments and audit/reset metadata |
| POST /admin/scenario | Admin; allowlisted next-attempt normal/delayed/failure; persists controlled input |
| POST /admin/reset | Admin; confirmed intent, expected generation, Idempotency-Key; exclusive atomic reset; return new generation + seed summary |

## Idempotency and retries

Client creates/persists one random key per intent before sending; do not generate a new key merely because of timeout/refresh. Bind key to principal, operation, generation and canonical payload digest. Same key/body returns the original payment and its current state (including terminal); different body is `IDEMPOTENCY_CONFLICT`. Concurrent same-key submissions serialize using uniqueness and read the winning result. Different keys for one active request yield existing owned attempt or REQUEST_BUSY; paid request yields REQUEST_PAID, not a new payment. Do not expose another payer's key or identity in conflicts.

The client sends no editable amount for execution: expected_amount_units is a comparison against server request, never authoritative. After definitively failed attempt a new key is allowed if the request remains valid. Persist lookup path/payment ID for recovery. Not-found after a lost response is not proof the old request cannot still arrive: resubmit the same key, never create a second intent.

Reset replay must not increment generation again: retain the reset operation's idempotency result in reset audit/control storage outside cleared fixture records; an old valid reset key returns its original result. Other old-generation keys fail DEMO_RESET. Session invalidation after reset requires re-entry; interrupted admin reset recovery can re-enter admin and query/replay its reset key.

## Errors and transport

Structured `{code, message, retryable, correlation_id, generation}` without secrets. Proposed statuses: 400 INVALID_QR/INVALID_AMOUNT/UNSUPPORTED_ASSET; 401 SESSION_REQUIRED; 403 FORBIDDEN; 404 NOT_FOUND; 409 REQUEST_PAID/REQUEST_BUSY/REQUEST_CANCELLED/INSUFFICIENT_BALANCE/IDEMPOTENCY_CONFLICT/NOT_CONFIRMED/DEMO_RESET; 410 REQUEST_EXPIRED; 503 TEMPORARILY_UNAVAILABLE. Payment failure after acknowledgement is returned in a 200 payment resource as `state=failed` with reason, not as evidence of transfer.

Network timeout has unknown outcome; poll/resolve same intent. HTTP 202 is acknowledgement only. GET results and polling drive both views. Mark stale/offline UI; backoff polling on errors; reconciliation never depends on a browser continuing to poll. No webhook, external provider endpoint or settlement API in initial demo.
