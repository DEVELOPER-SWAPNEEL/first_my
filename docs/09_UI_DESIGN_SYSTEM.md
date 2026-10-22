# UI design system and reference adaptation

## Reference access — 13 October 2026

[Public Cryptor reference](https://cryptor.framer.website/) was accessible through extracted page content: hero, service cards, process, wallet-style previews, features, FAQ and CTA. Its investment sections, metrics and social proof are unsuitable for this product. This was a content inspection, not a verified pixel-level visual/motion audit. [Private Framer project](https://framer.com/projects/Cryptor-copy--ScvJUapKRXp5qR9EzhWw-50UWb?node=augiA20Il) returned a loading/access error; no private edits were viewed or changed.

User-selected direction is premium dark, purple accents/gradients, clear typography, restrained motion and polished wallet/payment visuals. Tokens below are original proposed defaults, not extracted Framer styles. Do not assume source export, template license or image reuse rights. Implement original components; use system fonts/original simple graphics initially and record asset source/license before reuse.

## Proposed tokens and component rules

- Background #0B0914; surface #171323; raised surface #211A32; main text #F5F3FA; muted text #B8AEC9; primary #7C3AED; light accent #C4B5FD. Gradients decorative only. Validate contrast for actual text/background combinations; no reliance on color alone.
- System sans-serif; body 16px; page title 28–40px responsive; amounts 28–36px tabular numerals. Spacing 4/8/12/16/24/32/48px, cards 16px radius, subtle borders and sparse glow. Purple should guide actions rather than obscure payment facts.
- Mobile single-column at 360px; content max ~1120px desktop. Touch targets ≥44px. Visible keyboard focus, labelled fields/errors, screen-reader status updates and sensible heading order. QR high contrast with quiet zone, not a gradient; retain text/link fallback.
- Short 150–250ms opacity/position transitions; honor reduced motion. Never hide payment status behind animation. State text: “Sending request”, “Payment acknowledged”, “Outcome not yet known”, “Simulated payment confirmed”, “Payment failed”. Display merchant/amount on confirmation action; no ambiguous success checkmark before confirmation.
- Components: disclosure banner, role header, amount field, wallet card, QR card, request review, status timeline, receipt, history row, stale/error panel and reset dialog. All get fixtures for loading/empty/success/failure from screen contracts in docs/01_PROTOTYPE_SCOPE.md.

## Reference section → VARTAMAN narrative

Mapping is an adaptation, not a claim that the reference has a merchant-benefits section. Suggested copy is original.

| Reference pattern | Product section | Suggested copy / treatment |
| --- | --- | --- |
| Hero with primary CTA | Hero | “A clearer way to explore merchant crypto payments.” Subtext: “Scan a merchant request, review the amount and follow a simulated payment from authorization to receipt.” CTA: “Try the simulated demo.” |
| Service and feature cards | Features | “Amount-specific payment requests”, “Review before you authorize”, “One payment record for both sides”, “Receipts with clear status”. No custody/investment claims. |
| Numbered process | How it works | “Create a demo request → Scan and review → Authorize simulation → Check status and receipt.” Explain acknowledgement precedes confirmation. |
| Wallet/product graphics | Product preview | Original wallet, QR, status and merchant cards with DEMO labels; remove asset-price charts, portfolio returns and chain-looking hashes. Caption: “Illustrative prototype screens.” |
| Service cards / metrics area | Merchant benefits | “Show the amount before payment”, “Track requests in one view”, “Match receipts to payment records.” Replace metrics with workflow benefits, not invented savings or speed. |
| FAQ | FAQ | “Does this move real money? No.” “Is the INR value live? No, it uses an illustrative fixed rate.” “Is it settled to a bank? No.” “Will blockchain be used? Only in a separately scoped later testnet experiment.” |
| Repeated CTA / community form | CTA | “Explore the merchant-payment journey.” Buttons “Open customer demo” and “Open merchant demo”. Replace mailing-list form with role entry; no fake subscription confirmation. |

Remove trading/staking/tokenomics, invented testimonials, customer counts, partner logos, investment promises and guaranteed settlement/cost language. Planning targets and proposed commercial fee belong in project documentation, not public adoption claims.

## Milestone 1 implementation — 13 October 2026

The public reference hero was also inspected visually in the Codex in-app browser: dark canvas, purple halo, rounded controls and generous typography. This informed the direction; no source/assets were copied. The private project remains uninspected and unchanged.

Implemented tokens live in apps/web/src/styles.css: documented background/surface/text/accent values, #332942 borders, #B1EACB positive, #F1D69E warning and #FFB2BB failure text. Primary action uses #7C3AED → #6530C5. System fonts; original SVG V wordmark/icons; no remote fonts/images or third-party brand assets. The QR renderer qrcode.react is ISC-licensed; React/router are MIT dependencies.

Components: disclosure/header/navigation, cards, exact amounts/rate notes, wallet preview, QR card (black on white, four-module quiet zone), status presentation/timeline, history row, receipt, notices, skeleton/empty states and native dialogs. Reset/admin UI is deferred to M3. Layout uses 600/800/1100px adaptations, compact mobile navigation and desktop sidebar; no payment state animation. 180ms button transitions have a reduced-motion override. Compact asset labels have a 10px floor; key amounts are 36–52px, review/status headings 24–42px.

Native dialogs support Escape, modal focus containment and restoration (logical heading fallback when the initiating button is removed). Route navigation focuses h1. Inputs/validation errors are associated; states include text and announcements. CSS provides visible focus/≥44px interactive targets. Representative token contrast and browser checks are recorded in docs/13; this is not a comprehensive accessibility certification.

## Milestone 1.1 — 14 October 2026

The split marketing hero is superseded by the user's requested centered Cryptor-inspired composition: “Scan. Review. Pay.”, near-black #070410 landing canvas, concentrated violet glow, sticky icon/pill navigation, inset-capsule CTAs and a large original faceted V emblem/ribbon. Original payment medallions illustrate seven features; none are currencies or partners. New panels preserve explicit initial-versus-confirmed fixture labels. Asset provenance: docs/14; observation versus inference: docs/15.

Motion implementation lives in remix.css and components/Motion.tsx. Proposed timings implemented: 700ms staggered hero; 600ms reveal; 260ms present-only route; 300ms card; 280ms FAQ; 64s desktop/48s mobile ribbon; 8s glow/centerpiece; 28s rim. These are design choices, not measured Framer timings. No animation end changes data. Reduced motion shows everything immediately with static lighting; loops pause offscreen/background. Operational numbers/QR/text have no ongoing movement.

Mobile uses an accessible compact menu, 2×2 process steps and stacked product frames; desktop has a measured moving active indicator and paired previews. Native anchors provide smooth scrolling; route changes reset instantly and focus the new heading. FAQ buttons expose expanded state and collapsed answers are inert. Original app tokens/fixture safety remain in force.
