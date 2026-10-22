# Active exercise: trace and verify a persisted transaction

Outcome: use the working PostgreSQL-backed application and explain why a committed ticket survives an application restart. Allow 20–45 minutes. This remains the one active learner exercise; it has not been completed by the learner.

Predict first: does a blank title reach the database? Does stopping the API delete a committed ticket? If PostgreSQL stops, should liveness or readiness fail?

Follow README's native setup (the current server may already be running). Create a synthetic ticket through the interface, note its ID, inspect it, edit its description/status, then stop and restart only your own application process. Retrieve the same ticket. Try a blank title through `/docs`; identify the matching validation/outage tests in `tests/`.

The API validates before the handler runs, then commits a database transaction. PostgreSQL persists that record separately from the API process. The process can be alive while its database dependency is unavailable. Don't stop other services, remove volumes, or delete runtime data for this exercise.

Bring back: ticket ID/status before and after app restart, invalid-create HTTP status, relevant test output, and your explanation from browser request to committed record. Keep credentials and personal data out of the response.

Teach-back: which process owns persistence? Why is a completed backup a weaker claim than a verified fresh-target restore?

Codex supplied this prototype and its checks. Observing its results does not establish independent implementation or troubleshooting capability.
