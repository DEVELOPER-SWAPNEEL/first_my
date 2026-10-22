# Demo acceptance and verification

These are future executable checks, not claims that a working app exists. Milestone 0 verifies documentation only. Record pass/fail, fixture version/generation, environment, observed payment/request IDs and screenshots/logs at M4. Performance/capacity testing for 50 merchants/200 customers is not demonstrated by two views or fixture counts.

## Core rehearsal

1. Admin resets; A=100.00 DEMO, B=1.00 DEMO, Merchant A=0.00 DEMO; fresh sample request available, no previous payments.
2. Merchant creates 2.50 DEMO request; QR/link resolves same server amount/merchant. Customer scan or sample fallback reaches review. Illustrative INR says ₹250.00 at fixed ₹100/DEMO, not live conversion/settlement.
3. Authorization first shows submission, then durable acknowledgement. During injected delay, no final success/receipt appears. Polling confirms only after atomic ledger commit.
4. Both views show same payment ID, 2.50 DEMO and confirmed status; A=97.50, merchant=2.50; one debit/credit pair. Receipt clearly says simulated, settlement not applicable, no chain hash/explorer link.
5. Refresh both views; history/detail remains consistent. Reset and repeat yields same seed values and outcomes, with a new generation and fresh IDs.

## Required failure/invariant checks

| Check | Pass condition |
| --- | --- |
| Invalid QR/origin/version/tampered amount | Rejected or server canonical amount shown; no external navigation or authorization from untrusted fields |
| Camera denied | Sample QR/paste path completes valid review; no camera requirement for presentation |
| Expired/cancelled/paid request | New transfer refused; server checks expiry at acceptance and confirmation; paid record never undone |
| Double tap and same-key retries | One payment/transfer, same payment ID; changed body gives conflict |
| Competing customers / different keys, same request | At most one acknowledged active attempt and one confirmed transfer; loser has structured conflict or failure |
| Concurrent requests spending same customer balance | No negative balance; insufficient attempt fails; conserved total units |
| Decimal limits | Exact parsing; negative/zero/overflow/excess precision rejected; no Number-based money arithmetic |
| Timeout just before/after commit | Unknown outcome shown; same-key lookup/retry recovers; exactly one transfer |
| Refresh/offline during acknowledgement | Resume owned attempt; not-found causes same-key retry; no new intent until definitive terminal outcome |
| Backend restart at transaction boundary | Rollback or complete commit; persisted acknowledgement reconciles; no half debit/credit or paid/confirmed mismatch |
| Definitive provider failure | Failed payment reason visible to both; zero ledger entries; new attempt only if request open/unexpired |
| Insufficient funds | B cannot pay 2.50 DEMO; no debit or success receipt |
| Stale merchant/customer poll | Last sync/stale label visible; reconnect obtains canonical payment without duplication |
| Role/object access | Customer cannot inspect others; merchant cannot inspect another merchant; nonadmin cannot reset/select scenario |
| Reset race/retry | Atomic seeds, incremented generation, preserved reset audit/idempotent reset result; old sessions/QR/jobs cannot affect new data |
| Receipt/history | Confirmed snapshot consistent across roles; pending/failed detail never a success receipt; no invented chain metadata |
| UI and copy | Screen inventory L/E/S/F states present, keyboard/focus/readability/reduced motion checked; no investment/social-proof/settlement claims |

## Milestone 0 document checks

All 15 requested files present; README links resolve. Requirements/defaults/open choices separated. Canonical payment states are acknowledged/confirmed/failed; submission/unknown are UI-only and settlement is not applicable. Request states open/paid/expired/cancelled are consistent. Screens specify purpose/actions/data/states/simulation/acceptance. Testnet is separately scoped, pilot targets/fee provisional, private reference limitation recorded. No application code, dependency installation, deployment, Framer modification or commits in this mission.

Documentation verification completed 13 October 2026: all 15 requested Markdown files exist, local Markdown links resolve, and scope/state/retry/reset/receipt terminology was reviewed across the pack. Git shows only new documentation files; no application files or commits were created. Runtime acceptance cases above remain unexecuted until implementation.
