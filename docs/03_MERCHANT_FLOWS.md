# Merchant and admin flows

## Merchant

Enter as Demo Merchant A → create amount-specific request → show QR → watch request/dashboard → inspect corresponding payment.

Proposed request default: 10-minute lifetime from server clock; one successful payment per request; DEMO only. Amount is immutable after issue. To change it, cancel an open request and create another. QR contains version, demo generation and opaque request ID using an allowlisted demo URL; name/amount are fetched from the server. QR is not a wallet address or authorization credential.

Request page shows merchant, exact DEMO amount, optional illustrative INR, expiry and request state. Acknowledged attempt may display “Payment acknowledged; awaiting simulated confirmation” while request remains open. When confirmed, request becomes `paid` and links the canonical payment. Merchant totals include confirmed transfers only and describe demo units, not bank funds or settlement.

Dashboard polls scoped records, proposed every two seconds while visible. Refresh on focus/reconnect. Label stale data and last successful sync time; stale totals do not imply missing payments. Payment detail and customer receipt derive from the same payment row/snapshot. Never maintain independent client-only merchant success records.

Cancellation and authorization serialize on the request. Cancellation winning before confirmation prevents transfer; confirmation winning prevents cancellation. Request expiry is checked at authorization and transfer commit. An acknowledged attempt can fail if expiry occurs before confirmation; expiry never reverses a confirmed payment.

## Basic admin

Admin can inspect synthetic users, merchants, requests and payments; select an allowlisted failure scenario for the next attempt; reset demo fixtures. No arbitrary status/balance editing, identity documents, production user support or refund UI.

Reset requires an explicit in-app confirmation naming the demo data being cleared. In one exclusive transaction, increment generation, clear payment/request/ledger/idempotency scenario data, reseed personas and balances and retain a reset audit event. Fixture version is fixed; IDs include generation; old QR, keys, sessions and worker completions cannot modify the new generation. Admin re-enters after reset; customer/merchant clients show “Demo reset; start again.” Concurrent transfer/reset either commits entirely before reset or is rejected for stale generation. Failure rolls back reset entirely.

Proposed seeds: Customer A 100.00 DEMO; Customer B 1.00 DEMO; Merchant A 0.00 DEMO. Seed a fresh 2.50 DEMO sample request with expiry relative to reset time. Repeat reset yields the same starting values and fixture names, not reused generation IDs. Injected scenarios: normal, delayed confirmation, definitive provider failure; network interruption is tested client-side. No chain behavior is claimed.
