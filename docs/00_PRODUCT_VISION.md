# Vartaman Payment Prototype — Product Definition v1

Baseline: 13 October 2026. Owner: solo developer. Status: product definition; implementation choices provisional.

## Established requirements

Demonstrate merchant QR payments with a coherent customer/merchant experience: request → scan → review → authorize → status → receipt. Phase 1 includes branded marketing, customer onboarding and wallet interface, merchant requests and dashboard, history/receipts, basic admin, simulated payments and subsequent architecture/roadmap. It validates the product journey and technical invariants, not a production financial platform.

The pilot aspiration is 50 merchants and 200 customers; neither adoption nor performance has been proven. Proposed Phase 1 price ₹1,50,000 is subject to agreement. Optional testnet technical validation is separately scoped, not included by implication.

Success means a customer can understand whom they are paying and for how much, both parties see one consistent record, and failures/retries never invent success or duplicate the transfer. Completion is measured by docs/12_DEMO_ACCEPTANCE_CRITERIA.md, not revenue, settlement speed or token returns.

## Proposed defaults

Mobile-first browser demonstration; TypeScript; modular backend; candidate PostgreSQL; simulation provider boundary. One synthetic asset `DEMO` with two decimal places (an internal non-monetary unit, not a minted coin). Optional indicative display uses fixed illustrative ₹100 per 1 DEMO, never live pricing, redemption or INR settlement. Synthetic personas: Demo Customer A, Demo Customer B, Demo Merchant A and Demo Admin.

## Unresolved decisions

Browser versus initial native delivery, exact frameworks, final brand assets/copy, demo-device matrix, authentication approach, hosting and commercial agreement remain open. Expo/React Native is a later native candidate. These do not block screen foundations using the proposed defaults; revisit before relevant integration work.

Specialist/current research is needed before a real-value pilot: jurisdiction, applicable legal obligations, tax treatment, KYC/AML, custody/provider model, settlement, asset/network selection and security review. This pack makes no legal or regulatory conclusion. Historical UPI fees, taxes and software capabilities are not accepted evidence.

## Boundaries

No real money/mainnet, production custody or private keys, live fiat conversion, banking/withdrawal, production KYC/AML or identity documents. No trading, investment, custom tokens/chains, NFTs, staking, DeFi or tokenomics. No invented endorsements/adoption/partners or claims of legal approval, audited security, guaranteed zero fees/errors or instant final settlement.

Scope and screens: docs/01_PROTOTYPE_SCOPE.md. Canonical state model: docs/04_SYSTEM_ARCHITECTURE.md. Decision status: docs/10_DECISIONS.md.
