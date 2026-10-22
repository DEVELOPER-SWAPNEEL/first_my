# Personal website — local draft

Soren Hale reference structure in Next.js App Router, React and TypeScript. The homepage has all13 audited sections, supplied owner identity/portrait/contact, unapproved editorial work drafts and bounded M4A motion. The other40 destinations remain unfinished route placeholders; owner identity/contact are supplied and editorial/work claims remain under review.

## Run locally

Node 22.18+ (Node 24 recommended), npm:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For a local production preview: `npm run build`, then `npm start`.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run check:publication
```

The last command intentionally exits 1 while route/editorial/disclosure gates remain unfinished. Optional unprovided profile fields may be reported without being required for launch. `SITE_PUBLICATION_MODE=publish` also blocks Next startup/build. This is an engineering guard, not a hosting access control; there is no deployment workflow. Metadata disables indexing. No publication is authorized.

## Maintain

- `src/content/profile.ts`: owner fields, status, approval and verification date. Private/draft values are filtered before rendering. Aspirations and learning cannot fill current-fact slots.
- `src/content/routes.ts`: audited route registry and navigation. Detail slugs are temporary reference mappings, not project claims.
- `src/content/home-draft.ts`: unapproved editorial homepage copy and preview fixtures; keep separate from verified profile content.
- `src/components/home/`: reusable sections, scoped layout styles and small interactive boundaries.
- `src/components/shell/`: reusable shell; menu/header state, wordmark fitting and IST clock use small client boundaries.
- `src/components/motion/`: finite reveals, original portrait glyph renderer and mouse cursor.
- `src/styles/globals.css` / `motion.css`: colors, typography, shell, motion primitives and reduced motion.
- `src/fonts/`: self-hosted licensed font files; sources/hashes and OFL licenses retained.
- `docs/`: shared state, evidence, decisions and content gaps. `docs/reference/` remains reference-only.

See `docs/MOTION_SPEC.md`, `docs/MOTION_VERIFICATION.md`, `docs/PERSONALIZATION_VERIFICATION.md` and `docs/CONTENT_HANDOFF.md` for current scope/results. M1/M2 structural reports remain historical. Employer disclosure/attribution, further assets, detail families, exact motion fidelity and traced/throttled performance checks remain pending. No publication or deployment authorized.
