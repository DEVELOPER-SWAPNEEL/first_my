# M1 verification — 2026-10-13

## Scope

Runnable local Next 16.4 / React 19.3 / TypeScript foundation, responsive reference shell, accessible menu, separate draft profile and all 41 audited route placeholders. No homepage sections or detailed families. No deployment/publication.

## Checks and evidence

- Production build, TypeScript and ESLint pass. Three focused Node tests pass: private/draft filtering, current facts vs aspirations/learning, exact audited registry parity.
- All 41 direct HTTP destinations return 200 with server-rendered unfinished text. `/journey` returns 404. All internal destinations registered; three local font resources return 200. `m1/http-checks.json`.
- All 41 destinations exercised through footer/header or family-placeholder links, waiting for navigation before checking heading/URL. `m1/browser-links.json`.
- Pointer menu open/close/link navigation; Close receives initial focus; 20 Tab steps stay inside, reverse boundary wraps; Escape closes and returns to Menu. Native modal makes background inert; explicit boundary wrapping also prevents focus leaving for browser chrome. Skip link focuses main. `m1/keyboard-menu.json`.
- macOS Reduce motion enabled for test: computed caret animation `none`, header transition `0s`, menu row animation `none`; menu usable and Escape works. Original system preference restored to off. `m1/reduced-motion.json`, `m1/menu-reduced-motion-390.jpg` (earlier capture before final cosmetic changes).
- Browser warning/error log empty, including no observed hydration errors. `m1/console.json`, `m1/console-final.json`. No document overflow in exact viewports or 320,359,360,809,810,1099,1100,1279,1280 width checks. Scrollbars can subtract 15px from document client width. `m1/breakpoints.json`.
- npm production audit: zero vulnerabilities. Full audit reports five high dev-only transitive records from the ESLint config chain (braces advisory GHSA-vfj7-8cjw-p6xm); npm's suggested config downgrade is incompatible with installed Next. No forced downgrade. Recheck when upstream patch available.

## Comparison artifacts

At requested 390×844, 810×1080 and 1440×900 overrides: `m1/top-WIDTH.jpg`, `m1/footer-WIDTH.jpg`, `m1/shell-WIDTH.jpg`; menus `m1/menu-390.jpg`, `m1/menu-810.jpg`. Desktop has no visible hamburger, so open-menu comparison applies to phone/tablet. Footer captures include contracted headers. `m1/viewports.json` is intermediate dimensional evidence; tablet initial capture retained a prior scroll state (72px), while final `top-810.jpg` was independently recaptured at 88px.

Reference evidence: saved `reference/_-mobile-top.jpg`, `reference/_.jpg`, `reference/_-tablet.jpg`, `reference/menu-mobile.jpg`, plus targeted M1 `m1/reference-footer-WIDTH.jpg`, `m1/reference-menu-810.jpg` at exact dimensions. Targeted published inspection measured shell typography (`m1/reference-shell-fonts.json`) and footer styles (`m1/reference-footer-styles.json`; first sample retained phone classes after resize, so not desktop truth). Existing reference records preserved.

Visual inspection compared the same gutters, font families, row borders, navigation numbering, dark/lime colors and footer grids. Desktop/tablet header 88→72px; phone 68→60px. Desktop footer left identity + four columns; 810px tablet and phone identity above two columns. Corrected menu typography, row sizing, footer CTA, and wordmark resize behavior after inspection. Pair images `m1/compare-*.jpg` facilitate review; these compare shell states, not completed pages.

## Remaining differences and limits

- Draft Name/Profile pending/Contact pending replace template identity and claims. Shorter headline/contact/availability and draft metadata change wrapping, column balance, footer height and fitted wordmark size. No owner identity is verified.
- Pending social slots are plain text; no fake external/contact links. Time zone pending replaces the reference's Oslo clock; clock needs a verified public time zone. No invented copyright/location.
- Platform/editor/sales overlays temporarily excluded; their extra footer clearance is also excluded. Permanent removal undecided.
- Footer switches to its observed two-column layout at 810px; exact component threshold unavailable, local 900px breakpoint estimate. Header contraction threshold 24px is an explicit local estimate; state heights measured. CSS transition declarations are evidence; menu fade/stagger easing and timing remain visual estimates. Exit/page curtain, wordmark scramble and complex motion deferred.
- Same font families from official Google Fonts OFL sources, not proven identical reference revision/subsets. Full variable TTF files total about 746KB; later WOFF2/subsetting optimization must preserve measured appearance/license. No archived template imagery/source promoted.
- Native modal semantics, visible focus, 44px controls and scrollable menu improve accessibility. Physical touch device, Safari/Firefox, screen-reader session, low-power performance and real-device viewport behavior remain untested. Pointer at phone dimensions does not establish physical touch testing.
- M1 shell comparison is not exact replication or M2 completion. Production readiness needs verified content, lawful image decisions and broader fidelity/accessibility/performance testing.

Final production `next start` smoke check: all41 route placeholders returned200 with unfinished text; generated `/icon.svg` returned200. Added neutral authored caret favicon after observing the initial default favicon404 in server logs. Production preview process stopped after verification.
