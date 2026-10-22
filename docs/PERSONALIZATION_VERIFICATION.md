# Bounded M2 personalization verification

2026-10-14, Asia/Kolkata. Personalized local homepage and shared shell implemented. This is not full M2/M3, final editorial approval, motion fidelity, production readiness or publication. No delegation, other-project modification, infrastructure access, commits, push or deployment.

## Locally reviewable changes

Owner-approved name/display name, role, Bengaluru/IST, email, phone, GitHub/LinkedIn, availability wording, static portrait and unchanged resume PDF. `IstClock.tsx` hydrates from a stable server fallback and formats Asia/Kolkata time locally; no server/client timestamp mismatch. Portrait converted from approved1536×1024 PNG (1.88MB) to97,100-byte WebP, using Next Image preload/responsive sizes. No template image/source reuse. Asset hashes in OWNER_ASSETS.json.

All 13 section positions and dark/lime composition retained. CONTENT_HANDOFF.md lists proposed substitutions, deliberate career count change6→3, safe actual-source links and future real-slug mappings. Structured sanitized case records in work-evidence.ts; editorial data in home-draft.ts stays DRAFT/unapproved. Direct profile display approval does not open launch gates. Original fictional case URLs remain unfinished mapping destinations; personalized cards do not target them.

Brief opportunity/topic/message are ephemeral. The fixed-recipient mailto contains only encoded subject/body; composer opening is not sending or delivery. No email, phone call or external handler invoked during QA. CV uses a download link; browser-readable Resume page/print layout/full Contact form/detail families remain queued.

## Evidence organization and limits

CONTENT_EVIDENCE.md records source dates, statuses and disclosure/attribution gaps. Read private DOCX narrative/table content, inert HTML tables, all workbook sheets in memory, both resume pages and current LaunchOps records. AWS assessment copies confirmed byte-identical; read one as one source. Relevant public repository metadata/tree/README/source reviewed read-only without cloning/running code. No LaunchOps commands executed or files changed. No internal source text/assessment rows/configurations/screenshot files copied to repo or served assets.

Five temporary screenshot folders were macOS-permission denied; screenshots uninspected, not treated as corroboration. Later SMTP/dashboard counts remain owner reports. Historical report constraints, actual runtime evidence, plans and independent capability are separated. Raw resume is intentionally unchanged and remains owner-supplied material, not independently corroborated certification/project claims.

## Visual comparison artifacts

All paths below are under docs/personalization/. Each requested size is an exact browser viewport; vertical scrollbar leaves375/795/1425px content widths.

- 39 `viewport-{section}-{390|810|1440}.jpg` final homepage section frames; three `footer-{width}.jpg` frames.
- 39 `compare-{section}-{width}.jpg` pairs and `comparison-overview-{width}.jpg` contact sheets, visually inspected against existing docs/m2/reference-* frames. No full reference audit repeated.
- `geometry.json`: section rectangles, portrait response/crop and visible clock state. Headline wraps across three deliberate lines at all three sizes; desktop/photo crop differs from template because the approved source portrait is a landscape close-up. Mobile face remains readable; unavailable source-toggle overlay removed while the renderer stays deferred.
- `work-y{1472|2210|3018|3784}-1440.jpg`, `sticky-states.json`, `sticky-comparisons.jpg`: individual matching intermediate frames compared with saved reference frames2–5. Pins72/86/100/114px retained; next-card positions648.6/578.6/438.6/340.6px in their respective captures. Scale formula/activation thresholds remain the M2 estimates, not recovered source settings.
- `resume-browser-open.jpg`: supplied PDF rendered in Chrome, page1 of2. IAB showed blank PDF content; Chrome verified actual viewer rendering after its navigation wait timed out. Both source PDF pages were also rendered and visually inspected with the local PDF reader. Print output not tested.

| Section | Geometry assessment separate from content changes |
| --- | --- |
| Hero |900px desktop, approximately951px tablet /891px phone. Same upper-image/right-image layout and hero font scale; real biography/professional headline and review notice change smaller-screen height. Approved close-up cannot reproduce template subject pose/scale exactly. |
| Focus/status | Desktop187px; smaller screens wrap real technical labels/status text (tablet300px, phone408px). Difference from template client-name lengths is explicit, not a new marquee implementation. |
| Work | Five640px desktop cards and existing .82/1 grid/28px gap. Diagrams use image zones; mobile image-first1.6 crop retained. Fixed-card text/diagrams verified unclipped after correcting intrinsic grid minimum sizing. Typography/wrapping differs by real titles and boundaries. |
| About | Same narrative/image/Now layout; longer supplied biography changes height. Desk image remains neutral placeholder, not a fabricated personal workspace. |
| Work areas | Four decorative outline circles without score/fill; status panel uses Local/Prepared/Planned. Less score/metric text changes total height; no performance claims. |
| Stack |16 keys, same desktop board/detail arrangement and small-screen detail-first order. Longer evidence-context text replaces years/frequency bars. |
| Engineering areas | Four single-open rows/three expanded columns on desktop, vertical below. Commercial actions/prices replaced by contextual copy. |
| Career | Three real/qualified entries replace six fixtures; intentionally shorter section, not omitted slot. No fake dates/badges to preserve total page height. |
| Lab/notes/writing | Native rail and editorial layouts retained; explicit demos and proposed principles alter text density. No archived photos/avatars/quotes promoted. |
| FAQ | Eight single-open rows; real contact links in existing panel; long factual answers affect expanded height. |
| Brief/footer | Opportunity/topic controls preserve two selection groups; textarea adds natural height. Encoded composer action replaces disabled draft action. Long email, phone and full-name wordmark remain readable and within width at all target sizes. |

## Functional results

- Build, TypeScript, ESLint and six tests pass (logs alongside artifacts). Added meaningful contact encoding/recipient and sanitized case mapping tests; existing content-status/registry protection retained.
- Core identity, biography and work render in server HTML.13 sections in audited order. HTTP checks of all implemented internal home links succeed; PDF bytes match original SHA256 and response Content-Type application/pdf. Noindex metadata plus X-Robots-Tag applies to pages/assets; publication check/publish-mode guard intentionally reject launch.
- 16 keyboard-selected keys update their labelled panel.12 service/FAQ row checks retain at most one expanded panel; pointer/Enter/Space paths checked. No hover-only access.
- Menu native-dialog focus wraps across 23Tab presses; Escape closes/returns to Menu. Skip link focuses main. Footer/profile/mailto/tel hrefs match supplied values. LinkedIn identity/content not independently audited; no phone/email action performed.
- Lab next stops at its native boundary (tablet scrollLeft1235/max1235); Previous restores Next. Native horizontal scrolling remains touch alternative; physical touch not tested.
- Encoded mailto decoded/tested with ampersand, query-looking text, newline, script-like literal and Unicode. Fixed recipient unchanged; no Bcc/header injection; message bounded 1000characters. User text stays literal in summary. No backend, cookies, analytics, embeds or storage added.
- No document overflow at 320,390,810,901,1199,1200,1440px; all active homepage buttons at least44×44. `width-checks.json` shows work-body scrollHeight equal to clientHeight, including fixed desktop cards. Footer wordmark inspected at all three exact viewports.
- No observed warning/error/hydration entries (`navigation-checks.json`). Native final motion preference was reduce=false. Reduced branch/media rules exercised through a temporary repository-only override, then all three files restored immediately. `reduced-motion.json` shows relative/no-transform cards, no caret animation, working key/FAQ/brief controls and no overflow. OS preferences unchanged; this is branch simulation, not a physical-device reduced-motion test.

## Remaining review and next milestone

Review generated headline/biography/FAQ, proposed focus/work-area/principle substitutions and qualified timeline entries. Resolve employer disclosure/individual contribution, cleared evidence images, portrait authorship/source and template/component rights. Public candidates still need contribution/runtime reconciliation; no public LaunchOps URL supplied. Motion/source effects/counters/loops/curtains deferred. Screen-reader, Safari/Firefox, physical touch, performance budget and print/form/delivery signoff open. Existing dev-only lint dependency advisories remain outside scope.

Next dependency-ready task: bounded Work index/real-slug draft family using the sanitized records and explicit missing-evidence states, after editorial/mapping review. Sensitive case publication and motion assets remain dependent on permissions/evidence. No next family started in this pass.
