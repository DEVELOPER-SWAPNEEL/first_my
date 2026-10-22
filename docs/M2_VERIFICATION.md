# M2 bounded draft homepage verification

Verified 2026-10-13–14, Asia/Kolkata. This completes the authorized structural draft task only. Full M2, approved content, motion fidelity and production readiness remain open. No deployment, publication, delegation, new dependency or original reference image/source promotion.

## Implementation and safeguards

All 13 sections render in audited order inside the existing shell/footer. Reusable server sections live in `src/components/home/HomeSections.tsx`; draft fixtures in `src/content/home-draft.ts`; scoped styles in `Home.module.css`. `Interactive.tsx` holds the stack, accordions, lab and ephemeral brief state. `WorkDeck.tsx` wraps server-rendered cards with passive scroll/resize updates. Core content is present in the HTTP response.

Temporary counts: 8 client labels, 5 work cards, 4 score rings / 3 vitals, 16 stack keys, 4 offering rows, 6 career entries, 6 lab cards, 5 review rows, 1 featured article / 4 older rows, 8 FAQs, 5 kind / 5 range choices. Counts and neutral labels are structural fixtures, not approved owner content or commercial decisions. Detail slugs remain M1 reference mapping IDs and open unfinished destinations.

Visible unfinished-local-preview notice; claim-bearing fixtures marked pending; fixture records DRAFT / approvedForPublication=false. No template names, quotations, amounts, dates, skill proficiency, outcomes or ratings used as owner facts. Public profile remains null/draft. Noindex/nofollow and existing publication guards retained. CV, email and brief continuation are disabled with explanations. Brief values exist only in component memory, escape as text and never submit or persist.

## Artifacts and method

Primary evidence under `docs/m2/`:

- `viewport-{section}-{390|810|1440}.jpg`: 39 final local native viewport frames. Exact requested viewport sizes 390×844, 810×1080, 1440×900; vertical scrollbar yields content widths 375/795/1425.
- `reference-{section}-{390|810|1440}.jpg`: 39 corresponding reference viewport frames. Targeted homepage comparison only; the full 41-route M0 audit was not repeated. Source sales/editor overlays remain visible in reference captures and are temporarily excluded locally under M1 scope.
- `compare-{section}-{width}.jpg` and `comparison-overview-{width}.jpg`: side-by-side section pairs/contact sheets, visually inspected at all three sizes. `geometry-final.json` records final local geometry. `reference-phone-final-states.json`, `reference-desktop-final-states.json`, and `reference-tablet-capture-states.json` record capture states.
- `work-y{1472|2210|3018|3784}-1440.jpg`, `sticky-states-1440.json`, `compare-work-y*.jpg`, `sticky-comparisons.jpg`: four intermediate work states compared with `docs/reference/home-scroll-{2|3|4|5}.jpg` and `home-scroll-index.json`. These establish stacking inspection independently of flattened full-page images.
- `behavior-final-390.json`, `interactions-reduced-motion.json`, `lab-final-boundaries-and-resize.json`, `shell-keyboard-final.json`, `responsive-final.json`, `http-final.json`, `console-final.json`: functional evidence.
- `build.log`, `typecheck.log`, `lint.log`, `tests.log`, `publication.log`, `publication-mode.log`: check output.

Preliminary full-page images/crops are in `docs/m2/preliminary/`; do not use them for final alignment. Full-page capture briefly changed scrollbar/client width and could trigger the reference's tablet/phone mode switch; sticky flattening and entrance states also invalidate pixel-diff conclusions. Final native viewport frames avoid that problem. Source section heights can shift while its promotional bar/fonts/layout settle; comparisons align each section independently rather than assuming cumulative scroll coordinates remain identical. Tablet native frames use content width 795 and observed phone component reflow. Some geometry records taken during full-page capture show width810/tablet mode and are explicitly preliminary.

## Geometry versus draft differences

Observed common H2 sizes: desktop61.92px, tablet40px, phone37.44px, line-height1. Hero82.08px desktop /36.66px phone; About50.4px desktop /29.64px phone. Existing licensed local font families retained; exact reference binary revision is unproven. Desktop section padding129.6px, phone68px; desktop56px /phone20px horizontal gutter. Component fallback thresholds are estimates, not Framer settings.

| Section | Reference desktop height | Draft desktop | Draft tablet | Draft phone |
| --- | ---: | ---: | ---: | ---: |
| hero | 900.0 | 900.0 | 958.0 | 880.2 |
| clients | 234.5 | 187.2 | 299.5 | 391.5 |
| work | 3807.0 | 3807.0 | 4962.7 | 4039.7 |
| about | 979.9 | 940.6 | 1094.3 | 1192.8 |
| scores | 1177.3 | 1114.8 | 1610.6 | 1501.3 |
| stack | 1018.0 | 1020.0 | 1256.6 | 1341.0 |
| services | 1208.0 | 1148.4 | 1426.6 | 1613.8 |
| career | 1529.6 | 1592.8 | 1886.4 | 2338.3 |
| lab | 973.0 | 977.6 | 857.2 | 952.9 |
| reviews | 1167.8 | 1173.5 | 1300.7 | 1648.6 |
| writing | 1104.8 | 1107.0 | 1545.4 | 1417.1 |
| faq | 1017.4 | 1019.4 | 1327.5 | 1436.8 |
| brief | 964.5 | 913.4 | 1110.7 | 1310.3 |

Heights are pixels in the saved states, not equality acceptance targets: pending explanations, title wrapping and absent imagery change line counts. Main findings:

| Section | Structural comparison / remaining difference |
| --- | --- |
| Hero | Right-side 48% image zone on desktop; full-width upper image on smaller screens, copy and three stat slots below/overlapping its lower zone. Neutral cross placeholder omits portrait lighting/crop detail; draft notice and disabled-CV reason add space. Source renderer deferred. |
| Clients/status | Static eight-label strip; smaller screens wrap all labels and stack status fields. Neutral label lengths alter row count/height. Loop deferred. |
| Work | Five 640px desktop cards, .82/1 text/image grid,10px inset/gap,28px stride gap. Smaller screens image first with1.6 crop and natural-height text. Draft titles/explanations change internal text positions. Sticky states inspected separately below. |
| About | Desktop2.51/1 narrative/image grid; smaller screens narrative then left-aligned desk image then vertical Now fields. Image4/5; constrained image width approximately64% capped260px gives214.4px at phone. Biography length changes height. |
| Scores | Four236px-max rings across desktop, two columns below; three vitals across desktop, stacked below. Empty dashes, no numerical rating/fill/counter. Dark text and focus indication on lime retained. |
| Stack | Board left /384px detail right desktop. Small-screen detail above board, four key groups below. Neutral use/proficiency fields create different text density. All keys accessible by focus/click. |
| Services | Four single-open rows; desktop trigger columns and three expanded content columns; smaller screens vertical. Draft scope/price notices replace commercial assertions. |
| Career | Six entries, date/rail/content/tags columns desktop; rail with dates/content on right below. No invented dates, hashes, employers or contributions. Longer pending copy changes entry heights. |
| Lab | Six-card native overflow rail,370px desktop card/230px image; smaller cards below. Previous/next controls remain visible for keyboard/touch access; their small-screen row adds space relative to reference. No stars/download claims. |
| Reviews | Five code-style rows and line-number gutter; desktop reviewer/body columns, stacked smaller screens. Neutral circles replace unapproved avatars; pending prose is shorter than reference quotations. No quotation or rating. |
| Writing | Featured image1.78 plus four-row earlier-post column; one column below. No dates, reading-time values or sample article titles. |
| FAQ | Intro/contact left and eight rows right desktop; intro, accordion, contact below on small screens. First row initially open; neutral answers change panel height. |
| Brief | Choices left/code summary right desktop, vertical below. Five neutral kind and range choices; optional local label. Disabled continuation and explanation replace handoff. No prices or service approval implied. |

## Sticky work states: observed and estimated

Published frames show contracted-header pins72,86,100,114px as successive cards arrive, with approximately14px increments. Local captured pins match that sequence at scrollY1472/2210/3018/3784. Incoming card positions are within approximately single-digit pixels of the saved frames; draft text layout differs substantially and scramble is absent.

Local640px card +28px gap produces668px stride. Final geometry puts first natural card top approximately1453px; estimated pin thresholds are1381,2035,2689,3343,3997px (natural top minus72+14*i). Scaling is a linear estimate of4% per following-card stride, capped per remaining card count; exact source JavaScript/easing unknown. Desktop activation min-width1200/min-height760 is a local accessibility/fallback choice. CSS pins are observed published behavior, not verified Framer editor values.

Initial QA observed Reduce Motion ON, and the agent did not change the OS preference. An early normal-state pass used a temporary repository-only override, removed immediately afterward. At final verification on 2026-10-14 the browser natively reported reduce=false. All four final sticky screenshots/JSON were recaptured against restored production code in that native state; these replace the override captures. Both paths have therefore been observed: native normal stacking, and reduced-motion production flow (all five cards relative, transform none, controls usable) from the earlier checks. `safeguards-final.json` records final normal-state semantics/noindex/contrast/overflow. Keyboard focus brings covered cards above the stack and removes their scale. No dimming, scramble or entrance choreography added.

## Functional and engineering results

- PASS build, TypeScript, ESLint and four content/route tests. Added focused fixture test prevents accidental status/publication or unregistered-link regressions; no animation/testing dependency added.
- PASS 41 registered routes HTTP200, one H1 and noindex each; unknown /journey404. Homepage response contains all 13 sections in order; every implemented home href is registered. Detail families remain unfinished.
- PASS all 16 keys update selected panel via Enter; focus/Tab and pointer selection also checked. aria-pressed, labelled live region and aria-controls exposed.
- PASS service and FAQ groups expose at most one expanded row; Enter/Space switch rows and close the active row; hidden panels and labelled region semantics retained.
- PASS lab phone boundary at scrollLeft1655/max1655 disables Next; desktop max1122; resizing at end keeps Next disabled, Previous restores forward navigation. Native overflow/snap supplies direct touch/trackpad alternative. No physical touch-device test.
- PASS brief pointer and keyboard choices update code/text summary, only one choice per group; script-like input remains literal text. Continue disabled with accessible explanation. No submission/message destination.
- PASS shell menu opens, focus wraps across 20Tab steps in native dialog, Escape closes/returns to Menu; skip link focuses main. Existing footer links remain functional; shell files unchanged by M2.
- PASS no document overflow at320,359,360,390,809,810,900,901,1199,1200,1440px. All enabled homepage buttons at least44×44 in those states. No hover-only control, custom scroll interception or scroll trapping added.
- PASS no observed warning/error/hydration console entries in final local QA. Noindex/publication check exits1 intentionally; publish-mode config throws intentionally. These guards are not hosting access controls.

## Limits and deferred work

Stable readable states intentionally replace portrait/source rendering, scramble, counters/gauge fills, marquee loop, entrance/scroll reveals, page curtains and motion polish. No final owner copy, approved offerings, portrait, testimonial permissions, project evidence or destination approval supplied. Unapproved archived assets remain evidence-only. Physical touch, Safari/Firefox, screen-reader audit, production performance budgets and exhaustive link destination content are not signed off. Existing five dev-only lint-chain advisory records remain outside scope. Framer source/settings remain unavailable; no access restriction bypassed. This report does not establish exact replication or production readiness.
