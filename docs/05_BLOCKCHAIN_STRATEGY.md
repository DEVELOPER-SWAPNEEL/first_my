# Blockchain strategy

## Initial demo: established simulation-first boundary

No chain dependency, wallet keys, signatures, node calls, gas, token contracts or transaction broadcasts. DEMO is a synthetic internal balance unit, not a custom coin. Confirmation is an atomic database simulation. Receipts identify simulation and contain internal payment IDs only; no invented blockchain hashes/explorer links. Indicative INR uses a labelled fixed illustrative rate, not live conversion or settlement.

## Optional later testnet technical validation

Separate scope and commercial agreement must define one question: can a chosen test asset/network/provider demonstrate request-to-confirmation traceability? Asset/network, wallet model, signing location, faucet limits, provider dependencies, cost budget and confirmation/finality policy remain unresolved. Research current primary documentation when choosing them; do not assert support from historical discussions.

Before implementation, define chain-specific submitted/broadcast, provider acknowledgement, inclusion/confirmation, reorg/finality and failure behavior. A broadcast or provider response is not final success. Isolate testnet credentials, data, environment and receipts from simulation. Only genuine testnet hashes may have verified network-specific explorer links. Never represent testnet tokens as real monetary assets or testnet success as production readiness.

Completion evidence should include actual recorded testnet transfers, retries, network failure handling, observed confirmation conditions, operational limits and the unanswered production questions. Mainnet, production custody, bank settlement and real funds remain excluded. No testnet work is authorized by Milestone 0 or baseline Milestones 1–4.
