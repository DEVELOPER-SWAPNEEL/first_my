# Milestone 1.1 — Cryptor visual remix and motion verification

Completed 14 October 2026. Existing M1 routes, fixtures, exact amounts, camera cleanup, strict links, dialogs and confirmed-only receipts preserved. This is a visual refinement; no backend/database/payment engine/blockchain/deployment/paid service/commit work performed. Milestone 2 remains unstarted.

## Reference inspection: observed versus inferred

Live public reference: https://cryptor.framer.website/. Inspected in the Codex in-app browser at 1440px desktop and 390px mobile, with full-page captures and section/navigation observations. Private Framer project was neither opened nor modified.

Observed: centered desktop hero on near-black with violet top glow; rounded navigation/active item and luminous CTA capsule; large central emblem over a horizontal circle ribbon; sticky header remaining at top after scroll. A desktop hero DOM measurement was 1057px high at a 1440×1000 viewport (1425px content width). Mobile has a compact menu overlay, centered text/CTA and proportionally smaller centerpiece. Separate observations showed the hero words transitioning from blurred/faint to clear and different ribbon symbol positions. Service/feature cards use layered illustrations and violet borders/lighting; process changes to a mobile carousel; rounded FAQ items toggle answers, with opening another answer closing the former. Reference sections also include content excluded from VARTAMAN (investment/social proof/tokenomics).

Our timing/easing, hover styles, reveal thresholds and process-grid treatment are design choices. Exact reference animation durations, its complete hover behavior and every animation state were not measured. Full-page captures can include unrevealed reference elements; static captures alone do not prove motion. The VARTAMAN FAQ permits independent answers, rather than copying the reference's single-open state. VARTAMAN's process uses a readable mobile 2×2 grid. Template reuse rights were not established; all product assets are original (docs/14).

## Implemented refinement

- Centered “Scan. Review. Pay.” hero, merchant-payment copy, concise simulation disclosure; customer/merchant routes unchanged.
- Sticky pill navigation with original icons, active-section indicator, native anchor scrolling; compact mobile disclosure, Escape restoration, and section focus after selection.
- Luminous inset-icon CTAs and original faceted VARTAMAN emblem with circular rim, halo, beam and orbit layers.
- Continuous ribbon of seven payment-feature symbols with hidden decorative duplication; no currency/partner imagery.
- Layered feature cards, four-step process connectors, explicit independent customer/merchant preview scenarios, merchant illustration, FAQ, closing CTA/footer.
- Shared motion: staggered hero entrance; slow emblem/rim/glow/ribbon; scroll reveals; hover/press feedback; FAQ expansion; route/card entrances; skeleton shimmer; neutral pending-state ring. No success particles or automatic status/balance changes.
- CSS + native Web Animations + IntersectionObserver. No new motion library/dependency. PageMotion does not remount pages, preserving camera/dialog lifecycles. No exit animation postpones navigation or focus.
- AmbientRegion pauses loops when offscreen or document.hidden. System prefers-reduced-motion disables continuous/entrance motion and reveals all content. Development /preview has a clearly labelled reduced-motion override using the same static path; it is not a production user preference or OS setting.

Source: apps/web/src/pages/Marketing.tsx; components/MarketingNav.tsx, FAQ.tsx, PaymentVisuals.tsx and Motion.tsx; assets/visuals; remix.css. ui.tsx, Status.tsx, App.tsx and Gallery.tsx integrate shared motion. Fixture definitions/money/link/camera logic remain unchanged.

## Verification

| Check | Result and evidence |
| --- | --- |
| TypeScript / tests / build | Passed `check`, `test`, `build`; 17 tests across two files. Existing 12 fixture checks retained; five added for system reduced motion, keyboard FAQ, hidden ribbon duplication, DEV override and hidden-document pause |
| Routes/responsiveness | 60 checks: 12 representative marketing/customer/merchant/gallery routes × 360/390/768/1440/1920px. No document-level horizontal overflow or broken images. evidence/milestone-1-1/responsive-checks.json |
| Visual review | Desktop and mobile hero, features, process, product panels, merchant benefits, FAQ, closing/footer inspected; customer acknowledgement presentation also inspected. Full-page after captures use reduced-motion mode to show every section without unrevealed content |
| Local browser interaction | Mobile menu open/close and Escape; section selection; desktop active indicator; FAQ answer toggle; customer entry→wallet→review→explicit acknowledged fixture. Acknowledgement stayed unchanged across subsequent observation and showed zero receipt links; explicit selection of the confirmed fixture then opened its labelled receipt. Existing tests retain confirmed-only receipts, validation, persona and camera cleanup protections |
| Reduced motion | Browser DEV override: data-motion=reduced, ribbon animationName=none, hero opacity=1, zero hidden reveals, ambient paused. The browser OS media query was false; no OS setting was changed. Initially reduced system preference tested with matchMedia mock |
| Motion over time | 24 actual screenshot frames over 985ms; ribbon transform changed from −1016.03px to −1050.23px. Sampled GIF below uses those real frames (~1 second), not an interpolated video. No full 64-second loop video was captured |
| Seam geometry | Two identical long groups, each repeated twice, translate −50% of combined track. Coverage designed for tested wide viewport; no visible gap noted during sampled movement. Not a full-cycle frame-by-frame audit |
| Pause | Browser after scrolling to Journey: constellation data-paused=true and CSS animation-play-state=paused. document.hidden pause covered by mocked visibilitychange test; native background-tab behavior not independently recorded |
| Console/assets | Final inspected page log query returned no warnings/errors; new local images loaded. An initial data-URL symbol rendering issue was fixed with shared local SVG definitions and icons were visually rechecked |
| Focus/accessibility | Mobile Escape returns to menu toggle; selected section receives focus. Existing native dialogs/focus recovery and route-heading focus preserved; FAQ has aria-expanded/controls and inert collapsed content. No full screen-reader/device audit |
| Performance | No new runtime package or 3D stack. Main bundle about 105KB gzip, CSS about 14KB gzip. Continuous transforms pause offscreen; no balance counting, full-screen blur animation or scroll hijacking. No FPS/low-end-device benchmark performed |

Only the marketing-entry test selector changed to follow the new CTA copy. New tests address actual added motion/accessibility behavior rather than backend behavior. No lint configuration exists; no lint pass claimed.

## Evidence

- [Before desktop](evidence/milestone-1-1/before-desktop.jpg), [before mobile](evidence/milestone-1-1/before-mobile.jpg).
- [After hero, 1440px](evidence/milestone-1-1/after-hero-1440.jpg).
- [After full desktop](evidence/milestone-1-1/after-desktop-full.jpg), [after full mobile](evidence/milestone-1-1/after-mobile-full.jpg) — static reduced-motion captures.
- [Desktop features](evidence/milestone-1-1/features-desktop.jpg), [process](evidence/milestone-1-1/journey-desktop.jpg), [product previews](evidence/milestone-1-1/product-desktop.jpg).
- [Preserved acknowledged customer view](evidence/milestone-1-1/acknowledged-mobile.jpg), [explicitly selected confirmed receipt](evidence/milestone-1-1/receipt-mobile.jpg).
- [Sampled ribbon-motion GIF](evidence/milestone-1-1/ribbon-motion-sampled.gif), [frame timestamps/transforms](evidence/milestone-1-1/motion-samples.json).
- [Reference desktop capture](evidence/milestone-1-1/reference-desktop-full.jpg), [reference mobile capture](evidence/milestone-1-1/reference-mobile-full.jpg) — inspection evidence, not application assets.

## Run and remaining limits

```sh
cd /Users/john/Documents/ChatGPT/VARTAMAN
npm --prefix apps/web run dev
# http://127.0.0.1:5173/
npm --prefix apps/web run check
npm --prefix apps/web run test
npm --prefix apps/web run build
```

The already-running local server is retained for inspection, following the user's earlier request to leave it running. A new dev process should not be started while its strict port is occupied. Reload the browser for the updated design. No hosted deployment exists.

Physical devices, successful camera capture/QR decoding, native reduced-motion settings, full-loop timing and exhaustive hover/assistive-technology/performance verification remain untested. Previous camera feasibility limitation remains valid. The sampled GIF is short observation evidence, not a complete screencast.

Next mission remains M2: connect scoped synthetic sessions and server-resolved immutable requests through API DTO adapters; implement durable idempotent acknowledgement/reconciliation with atomic exact ledger updates; connect both views to one record; add real QR decoding/recovery while retaining fixtures and motion safeguards. M1.1 is complete before that work starts.
