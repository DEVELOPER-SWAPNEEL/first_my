# Prototype security model

## Threats and proportionate controls

| Threat | Required prototype control |
| --- | --- |
| Forged QR/amount/merchant | Strict version/origin/schema validation; resolve immutable request server-side; never navigate arbitrary scanned URLs |
| Cross-user payment/history access | Server session/role and object-ownership checks on every endpoint; opaque IDs are not access control |
| Double click/replay/concurrent spending | Idempotency binding, unique constraints, request/balance locks and atomic ledger commit |
| Reset racing payment | Generation guard and exclusive reset transaction; reject old sessions/jobs/keys |
| Admin control abuse | Backend admin checks; demo-only environment gate; bounded scenarios; reset confirmation and audit |
| Input or resource abuse | Exact amounts, size/range limits, pagination, rate limiting at backend where needed; safe rendering of labels |
| Session/web attacks | Candidate same-origin HttpOnly SameSite session cookies, CSRF protection for writes, no secrets in browser; secure cookies/TLS if hosted |
| Leaked personal or sensitive data | Synthetic personas only; no keys, identity docs, real balances or real contacts; redact cookies/tokens from logs |

Proposed onboarding is a synthetic persona session selector, not verified real-user authentication. It is adequate for a controlled demo with no real value; it does not prove production account security. Basic role controls still apply. Before exposing any demo publicly, review session entry, admin access gating, HTTPS, environment secrets and logs; do not present an openly selectable admin persona as protected production access.

Log internal request/payment correlation, state changes, reason codes and resets, not raw QR credentials or session tokens. Preserve immutable ledger and confirmed records during normal operation; explicit reset is the demo-only exception. Admin must not edit balances or manufacture confirmation.

Wallet interface does not hold private keys and is not evidence of production custody. Authorization is an explicit demo confirmation, not cryptographic signing or bank approval. No audited-security/legal-compliance claims. Future real-value use requires a separately specified threat model, authentication, custody/signing model, specialist review and operational controls.
