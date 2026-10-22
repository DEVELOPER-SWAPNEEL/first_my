# V3 frontend reference

User-selected source: https://framer.com/projects/WaitlistKit-copy--4mWHhnM9cI2vKgXX3iXc-23XB5?node=y9kumkAP3 . Inspected live V3 preview in Chrome on 2026-10-14; screenshots supplied by the user are additional visual references.

Observed heading: Inter, 600 weight, 62px size, 55.8px line height, -4.34px tracking, #d4d4d4 text. Reference uses black background, blue/cyan animated canvas, an iridescent star, translucent badge, circular top navigation and 400px rounded input/button capsule.

Implementation: local Inter 400/600 fonts, matching heading metrics and palette, reference star asset, CSS perspective rotation and entry transitions, recreated WebGL fluid-light shader. Canvas renderer settings and original star animation keyframes were not extracted; this is an adaptation, not a verified pixel/exact-timing copy. Existing API transactions remain functional. Hero action creates a synthetic ticket instead of collecting email; the ticket workspace follows the hero below the fold.

Motion: continuous blue/cyan field and rotating star, pause/resume using V3 control, reduced-motion preference, render suspension when page hidden, gradient fallback when WebGL unavailable. Reduced-motion behavior is implemented but OS preference emulation was not exercised.

Assets: star from https://framerusercontent.com/images/VSzb5uoCKwqDcdcEPBObTRu3wA.png (observed in reference DOM); template credited to Stacy More in reference. Inter downloaded from Google Fonts. Preserve provenance and establish template asset publication rights before public distribution; no public publication occurred.

QA: desktop and 390×844 viewport visually inspected; narrow layout has no horizontal overflow. Browser-created synthetic ticket ID 2; status changed to resolved and persisted after Refresh. Pause/resume and Readiness controls verified. No browser error/warning logs. Nine API tests pass; HTTP verification passed with synthetic ticket ID 3. Saved desktop image: ui-v3-desktop.png.

2026-10-14 prototype refinement: preserved Inter/assets/ambient shader and added actual PostgreSQL-backed inspect/edit/filter/pagination plus live DB/schema/release/backup-summary panels and safe recovery guidance. Browser creation/edit/filter/loading/empty/outage checks passed; keyboard focus ring and Escape/modal focus return checked; narrow390×844 no horizontal overflow; pause/resume verified. OS reduced-motion preference emulation unavailable; CSS/JS handling reviewed. Reference reinspection timed out; no new claim about original motion timings. Updated hero preview: prototype-desktop.png.
