# M4A motion specification

2026-10-14, Asia/Kolkata. Bounded homepage/shared-shell pass. Original implementation; no animation dependency or template source copied. Owner authorization supersedes earlier deferrals only for this scope. Content, disclosure and publication decisions are unchanged.

## Evidence and classification

Saved published CSS/scroll frames in REFERENCE_AUDIT.md, docs/reference/ and docs/m2/ remain the main evidence. Both supplied MOV files were readable: 15.958s and109.063s,1920×1080, reported75fps. Sampled contact sheets were inspected in temporary storage; these show interactions, not recovered component source/timings. They were not promoted to application assets.

Targeted live checks covered desktop/phone portrait toggles and desktop action hover. Source/render labels and localized pointer glyphs were observed. Desktop action sampling showed approximately−1.9/−1.1px translation and a paired arrow slide around34px at that sampled instant; these are state samples, not universal settings. Local actions use a restrained2px lift/3px arrow movement. No magnetic effect is claimed or implemented.

The copied Framer editor is now accessible in the existing browser session, superseding the historical onboarding login restriction. Read-only layer/property inspection showed Desktop1200, Tablet1199–810, Phone809–0; ShHero exposed Focus X50%, Focus Y18%, empty Source text with a React-component default hint, View source/View render labels and a pointer hint. These are exposed instance properties. They do not establish glyph grid, radius, renderer algorithm, compile timing, reuse license or every component breakpoint. No property was edited, source export obtained or Edit code opened. Approved owner portrait keeps its separately chosen72%/42% focal position.

## Implemented effects

| Effect | Trigger / timing | Replay, cancellation and fallback | Basis / difference |
| --- | --- | --- | --- |
| Action feedback | Fine-mouse hover or keyboard focus; lift2px/350ms, colors/borders300ms, arrow3px/450ms; press120ms | CSS interruption replaces current transition; disabled controls excluded; no translation/scale under reduce | Published timing declarations; sampled live hover; smaller authored arrow treatment |
| Links |350ms underline,300ms color; equivalent focus ring/underline | Native anchors/navigation; touch does not need hover | Published declarations; existing footer/nav treatments retained |
| Card media |450ms scale1→1.025 on hover/focus-within; no tilt | Only inner illustration/image layer moves; card owns stack scale separately; reduce resolves static | Restrained approximation/adaptation of image feedback to original illustrative assets; exact template hover scale not recovered |
| Stack/accordion controls |300ms color/border; expanded panel300ms opacity +6px settle | Single-open native buttons/hidden regions retained; no delayed click/focus; reduced animation none | Existing state model + authored feedback; no invented spring settings |
| Work-title compile | First viewport entry;760ms timestamp-based finite sequence;22 decorative symbol updates over duration | No hover replay. One callback chain/title; cancel to exact title on exit, hidden, preference change or unmount. Dimensions held by original text. Decorative layer aria-hidden; no live announcements | Observed subsecond–1s estimate; algorithm and760ms are original approximations |
| Heading words | First entry, masked110% rise;800ms cubic-bezier(.16,.84,.24,1),35ms/word capped210ms | Once per mount; no backward-scroll replay; fail/cancel shows static server text | Timing/ease from published CSS; stagger/entry margin estimates |
| Hero | Words1s transform,600ms opacity; eyebrow800ms/50ms delay | Finite CSS starts on first paint, resolves without hydration; restored browser scroll remains native; reduced motion immediate | Published timing; local coordination |
| Portrait/desk image entrance |900ms clip +1.04→1 settle, cubic-bezier(.7,0,.2,1) | One-shot; no continuous parallax; portrait and canvas use separate layers | Published declaration, observed reveal; static neutral desk slot remains |
| About illumination | Scroll progress from85% viewport through narrative height +30% viewport; opacity.6→1,180ms transition | Monotonic progress, stops scheduling at full illumination/offscreen/hidden; reduce full opacity; body paragraphs untouched | Observed behavior, original progress mapping/contrast floor |
| Dividers | First entry,900ms scaleX from left | Decorative absolute layer, no geometry change | Published hairline declaration; placement authored |
| Work stack | Existing640px desktop cards; pin72+14×index; scale decrement.04/stride;1200px/760px activation | Geometry cached on resize/intersection; scroll reads before writes; only scheduled while near viewport/visible; keyboard focus exposes covered card; reduced ordinary flow | Saved intermediate reference frames; formulas/thresholds remain estimates |
| Cursor | Mouse + hover/fine + no-reduce only;5px dot,26px ring→38px on enabled actions; outline follow65ms time constant | Dot immediate, clicks native; ring stops at.15px aggregate error. Native cursor restored on keyboard, pen/touch, edit/selection/resize cursor, exit, pointerdown/cancel, blur, hidden, modal, failure, route cleanup and preference change. OPEN links / VIEW portrait only | Owner-requested enhancement; dimensions and behavior intentionally local |
| Status/caret | Existing1.15s caret/2.2s status pulse, now finite3/2 iterations | No perpetual idle loop; global reduce disables | Published periods; finite repetition intentional performance difference |

Hero entrances use finite CSS from first paint to prevent hydration-time flashing; they resolve even without JavaScript. Other entrances share a homepage controller using IntersectionObserver, threshold0/bottom margin−28px, and temporary Web Animations frames. All base HTML/CSS is readable; nothing starts globally hidden. Initialization failure cannot leave content behind a hidden class. Finite frames cancel to readable content when interrupted. No indiscriminate will-change, animation framework, smooth-scroll layer or scroll trapping.

## Portrait renderer

PortraitSource retains the optimized Next Image as visible static/loading/failure fallback. A first suitable pointer event or source-toggle activation dynamically imports an original luminance renderer. Sampling occurs once per size, never every frame. Grid32–84columns/28–112rows; backing DPR≤1.5, width≤960px/height≤1200px. Cropping follows the approved portrait rather than template person/position. Glyphs are punctuation/density characters, not fabricated application code.

Full glyph mode is a native44px button with aria-pressed, descriptive text and live status. Keyboard/touch activation works without hover. Pointer-only mode uses a112px local aperture; canvas opacity220ms. Reduced motion suppresses pointer following and shows an immediate static source/render choice. Generation tokens discard stale async work; observers/listeners/frames clean up; offscreen/hidden drawing stops. Canvas failure preserves the image, resets state, explains the fallback and allows retry. Phone toggle128px (150px below360px) clears the local preview notice; this differs intentionally from the template overlay position.

## Deferred

No footer-wordmark scramble: the supplied recording/sampled footer states did not establish it, so the fitted real name stays stable. No marquee loop, counters/gauges, page curtains, route transitions, new diagram choreography, WebGL, video or new scene. No unfinished case is styled as a completed destination. Later source/rights requests are in MOTION_ASSET_REQUEST.md.

## Technical guidance consulted

[Framer effects](https://www.framer.com/help/articles/how-animations-and-effects-work-in-framer/), [Framer components](https://www.framer.com/developers/components-introduction), [Motion React](https://motion.dev/docs/react), [motion values](https://motion.dev/docs/react-motion-value), [reduced motion](https://motion.dev/docs/react-use-reduced-motion), [web.dev animation guidance](https://web.dev/articles/animations-guide), [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), [MDN pointer media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer). Installed Next server/client, Image, lazy-loading, pathname and Script guides were read. Browser primitives suffice; Motion was not added.
