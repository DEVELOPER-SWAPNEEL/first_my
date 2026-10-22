# TECHNICAL ARCHITECTURE

## Recommended build strategy

### Default: code-first

Use a modern React / Next.js application as the production source of truth.

Use Framer as a design/prototyping/inspiration partner when useful, not as an excuse to lose code ownership.

This is recommended because the website itself should demonstrate engineering quality and because advanced motion, content control, testing, and performance tuning benefit from direct code access.

## Recommended stack

### Core

- Next.js with App Router
- React
- TypeScript
- modern CSS / Tailwind CSS or a disciplined CSS architecture

### Motion

- Motion for React for component, layout, gesture, shared-element, and most scroll animation
- GSAP + ScrollTrigger only for sequences that genuinely need timeline/pinning/scrubbing control
- CSS transitions for simple micro-interactions

Do not use three animation systems for the same job.

### 3D / graphics

Optional:

- Three.js / React Three Fiber for one purposeful scene
- SVG for architecture and topology whenever 3D is unnecessary
- Canvas only where it materially improves the experience

### Content

Recommended initial choice:

- MDX files in the repository for projects and writing

Benefits:

- versioned with code;
- simple;
- fast;
- easy for Codex to edit;
- portable;
- ideal for a developer-owned site.

Move to a CMS only if editorial workflow requires it.

### Data / backend

No database is required for V1.

Use Supabase only if features require durable data such as:

- contact form storage;
- guestbook;
- reactions;
- authenticated private area;
- dynamic lab data.

Do not add a backend just to look sophisticated.

### Contact

Preferred options:

- server action + transactional email provider;
- simple mailto/link for V1;
- optional spam-protected form later.

### Analytics

Keep analytics privacy-conscious.

Possible:

- platform analytics for basic traffic;
- PostHog if detailed event/product analytics are genuinely useful.

Track meaningful actions, not everything.

Suggested events:

- project_opened;
- case_study_completed;
- resume_opened;
- article_opened;
- contact_clicked;
- github_clicked;
- linkedin_clicked.

## Suggested source tree

```text
src/
  app/
    (site)/
    work/
    writing/
    about/
    journey/
    resume/
    contact/
  components/
    layout/
    motion/
    ui/
    work/
    writing/
    diagrams/
  content/
  lib/
    content/
    analytics/
    seo/
    motion/
  styles/
  types/
public/
  images/
  diagrams/
  resume/
```

## Rendering strategy

Prefer static/server-rendered content for:

- homepage copy;
- about;
- projects;
- blog;
- resume.

Hydrate client components only where interaction requires them.

Do not turn the entire site into a client-side app because of animation.

## Animation boundary

Keep interactive motion components isolated behind client boundaries.

Text and content should still render without JavaScript where practical.

## Image handling

- responsive sizing;
- modern formats;
- defined dimensions to prevent layout shift;
- lazy loading below fold;
- preload only true hero assets;
- do not ship huge PNG diagrams.

## Framer integration workflow

If Framer is available to Codex:

1. create 2–3 visual directions in Framer;
2. select one direction;
3. prototype hero and one work section;
4. extract layout/motion principles;
5. implement production components in code;
6. keep content schemas in repo;
7. use Framer again for visual experiments, not as a second unsynchronized source of biography.

If the final production site is intentionally Framer-hosted instead, preserve the same content and truth rules and use Framer CMS for projects/writing.
