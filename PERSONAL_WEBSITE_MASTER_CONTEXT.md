

---

# SOURCE FILE: 00_READ_FIRST.md

# PERSONAL WEBSITE — CONTEXT PACK INDEX

## Purpose

This folder is the source-of-truth context for building a professional personal website that represents the person accurately, proves real engineering capability, communicates long-term ambition, publishes technical writing, and creates a memorable visual experience.

The website is not a generic portfolio template, resume clone, or collection of technology logos.

It should feel like a living professional identity system.

## Core outcome

A visitor should leave with five clear conclusions:

1. This person works on real infrastructure and engineering problems.
2. This person thinks in systems, evidence, failure modes, trade-offs, and reliability.
3. This person is early in the career journey but is deliberately building toward Platform/SRE and later AI infrastructure / ML platform work.
4. There is concrete proof: projects, case studies, writing, architecture, troubleshooting stories, and code.
5. The website itself demonstrates technical taste, frontend craftsmanship, motion design, performance awareness, and attention to detail.

## Canonical principle

PROVE > CLAIM.

Do not make the site impressive by inflating titles or skill levels. Make it impressive by presenting real work extremely well.

## Context file order

Read these files in order:

1. `AGENTS.md`
2. `01_WEBSITE_NORTH_STAR.md`
3. `02_IDENTITY_AND_POSITIONING.md`
4. `03_INFORMATION_ARCHITECTURE.md`
5. `04_HOME_PAGE_EXPERIENCE.md`
6. `05_VISUAL_DESIGN_SYSTEM.md`
7. `06_MOTION_AND_INTERACTION_SYSTEM.md`
8. `07_CONTENT_AND_DATA_MODEL.md`
9. `08_PROJECTS_AND_CASE_STUDIES.md`
10. `09_BLOG_AND_WRITING_SYSTEM.md`
11. `10_TECHNICAL_ARCHITECTURE.md`
12. `11_SEO_PERFORMANCE_ACCESSIBILITY.md`
13. `12_BUILD_ROADMAP.md`
14. `13_LAUNCH_AND_MAINTENANCE.md`
15. `14_CONTENT_GAPS_TO_FILL.md`

## Relationship to the Personal Career Operating System

This website must stay aligned with the existing Personal Career Operating System.

Relevant upstream concepts include:

- long-term direction: Infrastructure → DevOps / Cloud → Platform Engineering / SRE → AI Infrastructure / MLOps / ML Platform;
- current identity: early-career infrastructure / DevOps practitioner with real exposure to Linux, networking, deployments, monitoring, cloud/on-prem systems, and GPU infrastructure;
- proof-of-work philosophy: real production impact and serious projects matter more than badges and generic posts;
- public-proof safety: sanitize employer-specific and security-sensitive information;
- communication philosophy: explain complicated systems clearly rather than sounding complicated;
- no-inflation rule: aspiration must never be presented as current expertise.

## Editing rule

Whenever verified profile facts change, update the content data first. Do not bury biography, dates, skills, or links inside UI components.

## Current unknowns

Several personal facts are intentionally left as placeholders because they were not verified in the available source material. See `14_CONTENT_GAPS_TO_FILL.md`.


---

# SOURCE FILE: AGENTS.md

# AGENTS.md — CODEX OPERATING INSTRUCTIONS FOR PERSONAL WEBSITE

## Role

Act as a senior product engineer, creative developer, motion designer, information architect, accessibility reviewer, performance engineer, and editorial designer working on a single coherent personal website.

Do not behave like a template generator.

## Primary objective

Build a distinctive, production-quality personal site that makes the owner's real engineering work and future trajectory understandable, credible, and memorable.

## Non-negotiable rules

### 1. Never invent biography

Do not fabricate or infer:

- degree;
- university;
- graduation year;
- employer title;
- employment dates;
- certifications;
- awards;
- quantified impact;
- salary;
- number of years of experience;
- client names;
- project ownership;
- GitHub statistics;
- blog readership;
- testimonials.

Unknown facts must remain placeholders or be omitted.

### 2. Separate present from future

Use these semantic labels internally:

- `VERIFIED_CURRENT`
- `VERIFIED_PAST`
- `ASPIRATION`
- `LEARNING_NOW`
- `DRAFT`
- `PRIVATE_DO_NOT_PUBLISH`

Never transform `ASPIRATION` into a current skill claim.

### 3. Protect employer confidentiality

Never publish confidential infrastructure details.

Sanitize or omit:

- private IPs;
- hostnames;
- credentials;
- tokens;
- repository URLs;
- VPN details;
- exact internal firewall rules;
- private customer information;
- sensitive screenshots;
- proprietary source code;
- security weaknesses;
- unpublished architecture details.

Prefer generic nouns such as `Production Monitoring Host`, `Application Database`, `GPU Worker`, and `Internal Service`.

### 4. Proof over badges

Prioritize:

- real projects;
- architecture diagrams;
- case studies;
- failure investigations;
- technical writing;
- code;
- demonstrations;
- lessons learned.

Do not build a giant skill-logo cloud as the main proof mechanism.

### 5. Motion must have hierarchy

The website should contain a large amount of motion, but it must be orchestrated.

Use three levels:

- Signature motion: 2–4 unforgettable experiences across the whole site.
- Section motion: scroll reveals, transitions, shared elements, diagrams, depth.
- Micro motion: hover, focus, buttons, links, cards, cursor feedback.

Never make every object continuously move.

### 6. Performance is part of the design

Heavy visuals must be lazy-loaded and isolated.

Requirements:

- keep critical rendering path light;
- prefer transforms and opacity;
- pause or dispose offscreen animations;
- lazy-load WebGL / 3D;
- provide static/mobile fallbacks;
- avoid giant video backgrounds unless strongly justified;
- test low-power devices;
- honor `prefers-reduced-motion`.

### 7. Accessibility is not optional

All interactive UI must work with keyboard and screen reader semantics.

Motion cannot be required to understand content.

Maintain readable contrast, visible focus states, semantic headings, alt text, and reduced-motion alternatives.

### 8. Mobile is a first-class experience

Do not simply shrink desktop.

For mobile:

- reduce parallax amplitude;
- replace hover-only interactions;
- simplify 3D scenes;
- preserve narrative order;
- maintain large touch targets;
- avoid scroll-jank and viewport trapping.

### 9. Component discipline

Prefer reusable primitives:

- `AnimatedText`
- `Reveal`
- `MagneticLink`
- `ProjectCard`
- `CaseStudyHero`
- `Timeline`
- `SystemMap`
- `Metric`
- `ArticleCard`
- `SectionHeader`
- `PageTransition`
- `ReducedMotionBoundary`

Do not build the entire homepage as one component.

### 10. Content lives outside presentation

Use structured data or MDX for:

- profile;
- experience;
- education;
- projects;
- case studies;
- blog posts;
- links;
- achievements;
- resume metadata.

### 11. Engineering quality

Use TypeScript.

Avoid `any` unless unavoidable.

Use clear naming.

Remove dead code.

Do not leave console errors.

Do not add dependencies without a concrete need.

Write comments only where intent is non-obvious.

### 12. Visual quality gate

Before declaring a section complete, review:

- hierarchy;
- spacing;
- typography;
- animation timing;
- alignment;
- contrast;
- responsive behavior;
- loading states;
- empty states;
- reduced motion;
- keyboard navigation;
- performance.

### 13. No generic AI copy

Avoid phrases such as:

- “passionate developer”;
- “technology enthusiast”;
- “innovative problem solver”;
- “I love turning ideas into reality”;
- “cutting-edge solutions”;
- “results-driven professional”;

Write concrete copy grounded in actual work.

### 14. Framer workflow

If a Framer integration is available in the Codex environment, use it for:

- visual exploration;
- layout directions;
- motion references;
- prototype sections;
- component inspiration;
- CMS experimentation.

Do not allow the Framer representation to silently diverge from the code/content source of truth.

### 15. Make the website itself a project

The final repository should be credible enough to appear as a selected project.

Document:

- architecture;
- animation system;
- performance trade-offs;
- content model;
- accessibility approach;
- deployment;
- lessons learned.


---

# SOURCE FILE: 01_WEBSITE_NORTH_STAR.md

# WEBSITE NORTH STAR

## Mission

Create a professional digital home that communicates identity, engineering capability, trajectory, work, thinking, writing, and ambition in a way that is memorable to recruiters, engineers, hiring managers, collaborators, and technically curious visitors.

## The site must answer

Within the first 30–60 seconds, a visitor should understand:

- who this person is professionally;
- what kinds of systems they currently work around;
- what they are becoming;
- what they have actually built or solved;
- where to inspect deeper proof;
- how to contact them.

## Positioning thesis

The owner's strongest emerging story is not “full-stack developer who knows many technologies.”

It is approximately:

> Early-career infrastructure / DevOps engineer building deep systems capability through real work in Linux, networking, deployments, observability, cloud/on-prem infrastructure, reliability, and GPU environments—progressing deliberately toward Platform/SRE and eventually AI infrastructure / ML platform engineering.

This is a working positioning statement, not permanent copy.

## Website job

The site should convert:

REAL WORK
→ CLEAR STORY
→ VISIBLE PROOF
→ PROFESSIONAL TRUST
→ OPPORTUNITY

## Priority audiences

### 1. Engineering hiring manager

Needs to know:

- Can this person reason?
- Can this person build and troubleshoot?
- Is the technical foundation real?
- Does the person understand production risk?
- Is growth velocity strong?

### 2. Recruiter

Needs to know:

- What roles fit?
- What technologies and domains are credible?
- Where is the resume?
- How can I contact this person?

### 3. Senior engineer / potential mentor

Needs to see:

- technical seriousness;
- curiosity;
- architecture reasoning;
- transparency about gaps;
- evidence of learning through building.

### 4. Collaborator / founder / client

Needs to see:

- ownership;
- clarity;
- reliability;
- communication;
- ability to turn vague problems into working systems.

## Success definition

The website succeeds when:

- people remember the owner after leaving;
- visitors explore at least one serious project or article;
- recruiters can understand role fit quickly;
- strong work is easier to discuss during interviews;
- published work becomes searchable and shareable;
- site quality itself demonstrates engineering and creative capability.

## Anti-goals

Do not optimize for:

- maximum number of animations;
- maximum number of skills;
- flashy gradients with no information hierarchy;
- fake terminal aesthetics;
- vanity GitHub counters;
- exaggerated expertise;
- generic motivational biography;
- dumping the entire resume onto one page.

## Long-term evolution

The website should grow with the career.

Version progression:

### V1 — Identity + Proof

Strong homepage, selected projects, about, resume, contact, writing foundation.

### V2 — Case Study Engine

Deep case studies, architecture diagrams, project filtering, richer writing.

### V3 — Specialist Identity

As real capability deepens, the visual and editorial story should increasingly emphasize Platform/SRE, observability, AI infrastructure, GPU systems, or whatever specialization is actually earned.

### V4 — Professional Knowledge Hub

The site becomes a durable technical archive with strong search visibility, articles, talks, open-source work, and high-quality project documentation.


---

# SOURCE FILE: 02_IDENTITY_AND_POSITIONING.md

# IDENTITY AND POSITIONING

## Core identity model

The website should present identity in four layers.

### Layer 1 — Present

What is true now?

Current working narrative:

- early-career infrastructure / DevOps practitioner;
- hands-on exposure to real Linux servers and operational systems;
- practical work involving networking, deployments, monitoring, databases, AWS/on-prem environments, backups, and GPU telemetry;
- observability and infrastructure troubleshooting are credible current themes.

### Layer 2 — Evidence

What proves the present identity?

Examples of acceptable evidence categories:

- production-style monitoring architecture;
- Prometheus / Grafana / Alertmanager work;
- exporters and service checks;
- cause-aware alerting concepts;
- routing/firewall/network-path troubleshooting;
- backup/recovery thinking;
- application deployment work;
- architecture documentation;
- GPU/DCGM telemetry exposure;
- sanitized infrastructure case studies.

### Layer 3 — Direction

Where is the owner going next?

Current strategic direction:

Infrastructure
→ DevOps / Cloud
→ Platform Engineering / SRE
→ AI Infrastructure / MLOps / ML Platform
→ Senior / Staff / Lead / Architect-level responsibility

The website may show this as a journey, roadmap, or “what I am building toward” section.

### Layer 4 — Values

What kind of engineer is being built?

Emphasize:

- systems thinking;
- evidence before assumptions;
- troubleshooting;
- operational competence;
- reliability;
- clear communication;
- learning by building and breaking;
- honest self-assessment;
- depth over tool collecting.

## Tone

The voice should be:

- precise;
- technical;
- direct;
- ambitious;
- human;
- curious;
- confident without pretending certainty;
- professional without corporate filler.

## Suggested homepage positioning patterns

Do not finalize until personal facts and preferred voice are confirmed.

Possible structure:

**Eyebrow**
Infrastructure • Reliability • Platform

**Primary statement**
I build, operate, and understand the systems behind modern software.

**Secondary statement**
Currently growing through hands-on work across Linux, networking, observability, deployments, cloud/on-prem infrastructure, and GPU systems—moving toward Platform/SRE and AI infrastructure.

Alternative bolder direction:

**Primary statement**
I like systems most when they are real enough to fail.

**Secondary statement**
Infrastructure, observability, networking, deployments, reliability, and the path toward modern AI platforms.

These are copy directions, not verified final biography.

## Aspirations section

Aspirations should not read like fantasy titles.

Use a grounded structure:

### What I am becoming

- deeper systems engineer;
- independent production troubleshooter;
- platform/reliability engineer;
- eventually, an engineer capable of operating modern AI/ML infrastructure.

### What I want to be able to do

- design systems, not only configure tools;
- reason about scale, reliability, security, cost, and failure;
- build infrastructure that is observable and recoverable;
- explain architecture clearly;
- own systems end-to-end.

## Skills presentation

Avoid “90% Linux / 85% AWS.”

Prefer skill groups with evidence.

Example:

### Operating Systems & Infrastructure
Linux, systemd, service operation, server administration

**Evidence:** service deployment, troubleshooting, monitoring, backup work

### Networking
Routing, NAT, firewalls, DNS/TCP investigation

**Evidence:** multi-network connectivity and firewall troubleshooting

### Observability
Prometheus, Grafana, Alertmanager, exporters, service health

**Evidence:** production-style monitoring and alert design

### Cloud / Delivery
AWS exposure, application deployment, CI/CD, Nginx

**Evidence:** deployment and cloud/on-prem work

### Data Services
PostgreSQL, MongoDB, Redis

**Evidence:** operational exposure in deployed systems

### GPU / AI Infrastructure Exposure
NVIDIA systems, DCGM, telemetry

**Evidence:** GPU monitoring work

Use the word `exposure` where depth has not been demonstrated.


---

# SOURCE FILE: 03_INFORMATION_ARCHITECTURE.md

# INFORMATION ARCHITECTURE

## Recommended route structure

```text
/
/about
/work
/work/[slug]
/writing
/writing/[slug]
/journey
/resume
/contact
/now                 optional
/lab                 optional later
```

## Primary navigation

Keep top navigation small:

- Work
- Writing
- About
- Journey
- Resume

Contact can be a visually distinct action.

## Home page content order

1. Cinematic hero
2. Current professional identity
3. Selected work
4. Interactive systems / focus map
5. Proof strip: real work themes
6. Career journey / direction
7. Latest writing
8. About teaser
9. Resume / contact finale

## About page

Purpose: answer “who is the person behind the work?”

Sections:

- concise personal introduction;
- current professional focus;
- working philosophy;
- education;
- selected achievements;
- interests outside work if the owner wants them public;
- career aspirations;
- photo / visual portrait;
- links.

Do not duplicate every project here.

## Work index

Use a visual editorial grid, not a generic card wall.

Filter concepts later if enough projects exist:

- Infrastructure
- Observability
- Networking
- Reliability
- Cloud
- Platform
- AI Infrastructure
- Personal Builds

Only show filters once the collection is large enough.

## Case study route

Every serious case study should contain:

- problem;
- context;
- constraints;
- role / contribution;
- architecture;
- investigation or implementation;
- difficult decisions;
- failures / challenges;
- validation;
- result;
- lessons;
- sanitized technical artifacts;
- source/code/demo where public.

## Writing index

Categories may include:

- Infrastructure
- Linux
- Networking
- Observability
- Reliability
- Cloud
- Platform Engineering
- AI Infrastructure
- Career Notes

Keep professional technical writing primary.

## Journey page

This is where aspirations belong most naturally.

Suggested visual narrative:

```text
FOUNDATIONS
↓
INFRASTRUCTURE / DEVOPS
↓
PLATFORM / SRE
↓
AI INFRASTRUCTURE / ML PLATFORM
```

Each stage should show:

- what is already true;
- what is being learned;
- what is future-facing.

Use clear status labels.

## Resume page

Provide:

- browser-readable resume content;
- downloadable resume PDF once supplied;
- current version date;
- contact and profile links.

The page must remain useful even if PDF download fails.

## Contact page

Simple, fast, human.

Possible actions:

- email;
- LinkedIn;
- GitHub;
- optional contact form.

Do not collect unnecessary personal information.

## Optional `/now`

A concise page for:

- what I am working on;
- what I am learning;
- what I am reading/building;
- current professional focus.

This can keep the site feeling alive without rewriting the About page.

## Optional `/lab`

Later, use for small experiments:

- visualizations;
- interactive infrastructure diagrams;
- WebGL experiments;
- network demos;
- observability widgets;
- creative coding.

This section should never distract from serious work.


---

# SOURCE FILE: 04_HOME_PAGE_EXPERIENCE.md

# HOME PAGE EXPERIENCE

## Goal

The homepage should feel like a 60–120 second guided experience even though the visitor can freely scroll and navigate.

The visual language should communicate “systems engineer with creative taste,” not “designer pretending to be a hacker.”

## Sequence 1 — Entry / hero

### Visual concept

A calm dark canvas with a subtle living system topology.

The topology may contain abstract nodes representing:

- compute;
- network;
- observability;
- storage;
- cloud;
- GPU / AI workload.

Lines do not need labels immediately. They come alive as the intro runs.

### Entry animation

1. minimal boot-like pulse;
2. identity line appears;
3. topology resolves from noise into structure;
4. primary statement enters with high-quality text choreography;
5. cursor movement subtly influences depth;
6. scroll cue emerges.

Do not use a fake terminal typing biography.

## Sequence 2 — “What I work on”

As the user scrolls, abstract topology becomes concrete.

Possible sentence progression:

> Servers are only one layer.

> Networks, deployments, databases, metrics, failures, and recovery are the system.

Then reveal current areas through an interactive diagram.

## Sequence 3 — Selected work

Use 3–5 featured projects maximum.

Each project gets a distinct visual motif rather than identical cards.

Examples:

- observability project → live metric-line language;
- network reliability project → animated packet path / route map;
- backup project → layered timeline / restore points;
- GPU telemetry project → compute-grid / thermal/metric field;
- personal website → creative system map.

On click, use a shared-element transition into the case study.

## Sequence 4 — “How I think”

Display the troubleshooting loop as a living flow:

SYMPTOM
→ EVIDENCE
→ HYPOTHESIS
→ TEST
→ ISOLATE
→ REMEDIATE
→ VERIFY
→ PREVENT

Animate one stage at a time on scroll.

This is more differentiated than another skills grid.

## Sequence 5 — Journey

Create a long horizontal or diagonal career path.

Stages:

- current foundations;
- DevOps / Cloud;
- Platform / SRE;
- AI Infrastructure / ML Platform.

Use visual distinction:

- completed/current stages = solid;
- learning = active pulse;
- future = outlined / distant.

Never visually imply future expertise is already earned.

## Sequence 6 — Writing

Transition from visual-heavy sections into an editorial reading atmosphere.

Show 2–4 recent articles with:

- title;
- one-line thesis;
- reading time;
- category;
- date.

Typography should carry this section more than effects.

## Sequence 7 — Closing statement

The final section should be calmer than the hero.

Possible structure:

**Large statement**
I am building toward the kind of engineer who can own the system, not just operate the tool.

**Actions**
View Resume
Read My Work
Contact Me

## Homepage anti-patterns

Avoid:

- 20 skill icons in the hero;
- GitHub contribution graph as a centerpiece;
- giant profile photo with generic introduction;
- auto-playing showreel with no content;
- every section using a different animation style;
- constant cursor trail particles;
- excessive glassmorphism;
- fake command-line prompts;
- 3D objects unrelated to the story.


---

# SOURCE FILE: 05_VISUAL_DESIGN_SYSTEM.md

# VISUAL DESIGN SYSTEM

## Recommended creative direction

### Name

INFRASTRUCTURE NOIR / TECHNICAL EDITORIAL

### Personality

- dark;
- precise;
- premium;
- technical;
- cinematic;
- minimal at rest;
- expressive in motion;
- slightly industrial;
- editorial rather than dashboard-like.

## Design contrast

The site should alternate between two modes:

### SYSTEM MODE

Dark background, diagrams, motion, topology, metrics, code fragments, architecture.

### EDITORIAL MODE

More whitespace, strong type, calm reading, essays, biography, reflection.

The contrast prevents visual fatigue.

## Color strategy

Start neutral:

- near-black;
- charcoal;
- warm off-white;
- subtle gray hierarchy.

Use one primary signal accent and one rare secondary accent.

Possible signal accent directions:

- electric lime;
- cyan-blue;
- high-energy amber.

Do not use a rainbow tech palette.

The final accent should be selected after visual exploration.

## Typography

Use a maximum of 2–3 type families/roles:

- primary sans for UI and headings;
- monospaced face for technical metadata;
- optional editorial serif for selected narrative moments.

Large typography should be a major design element.

Do not rely on tiny monospace text everywhere to look technical.

## Grid

Desktop:

- strong 12-column grid;
- wide margins;
- occasional intentional breakout sections.

Mobile:

- simple 4-column logic;
- generous horizontal padding;
- no edge-to-edge dense text.

## Shape language

Prefer:

- precise geometry;
- thin rules;
- topology paths;
- technical labels;
- controlled rounded corners;
- sparse glow.

Avoid:

- bubbly SaaS cards;
- excessive pills;
- random neon gradients;
- generic dashboard widgets.

## Imagery

Use real personal photography only if it is strong and intentional.

Possible uses:

- one high-quality portrait;
- workbench / infrastructure photos when safe;
- abstract macro textures;
- diagrams generated from real systems.

Do not publish sensitive office/server photos without review.

## Architecture diagrams

Architecture graphics should become a signature part of the visual identity.

Use a unified diagram system:

- same node radius;
- same arrow style;
- same grid;
- same labels;
- consistent semantic states;
- animated paths only when they teach flow.

## UI density

Homepage can be visually rich.

Case studies and writing should be much calmer.

The deeper the content, the less motion should compete with reading.


---

# SOURCE FILE: 06_MOTION_AND_INTERACTION_SYSTEM.md

# MOTION AND INTERACTION SYSTEM

## Motion philosophy

The site should feel engineered, not decorated.

Motion communicates:

- causality;
- hierarchy;
- state;
- navigation;
- system flow;
- depth;
- personality.

## Motion levels

### Level A — Signature sequences

Use only a few.

Recommended:

1. Hero system-topology reveal.
2. Project-card → case-study shared transition.
3. Career journey transformation.
4. One interactive architecture/system map.

These should be the memorable moments.

### Level B — Section choreography

Use:

- pinned narrative sections where justified;
- scroll-linked transforms;
- mask reveals;
- layered parallax;
- SVG path animation;
- staggered text;
- image reveals;
- sticky project storytelling.

### Level C — Micro-interactions

Use:

- magnetic links sparingly;
- spring hover feedback;
- underline dynamics;
- cursor affordances;
- focus state animation;
- pressed states;
- navigation morphing.

## Animation primitives

Create reusable primitives rather than bespoke timing in every component.

Suggested primitives:

- `FadeUp`
- `BlurReveal`
- `SplitTextReveal`
- `StaggerGroup`
- `ParallaxLayer`
- `ScrollProgress`
- `PathDraw`
- `Magnetic`
- `SharedProjectTransition`
- `PageCurtain`
- `SpringHover`
- `CountOrMetricReveal`

## Timing language

Define tokens:

```text
fast        ~120–180ms
standard    ~220–360ms
slow        ~500–800ms
cinematic   ~900–1600ms
```

These are design ranges, not rigid constants.

## Easing language

Prefer:

- springs for physical UI movement;
- smooth custom easing for cinematic entrances;
- linear mapping for scroll-linked progress when appropriate.

Avoid using the same ease for everything.

## Cursor system

Desktop only.

The custom cursor may:

- expand on links;
- show `VIEW`, `OPEN`, or `DRAG` context;
- create subtle spotlight depth in selected sections.

Requirements:

- never hide the native cursor without reliable replacement;
- disable on touch;
- do not create constant particle trails;
- avoid accessibility interference.

## Scroll behavior

Smooth scrolling may be used only if it does not break:

- browser navigation;
- anchor links;
- accessibility;
- keyboard input;
- scroll restoration.

Prefer native-feeling physics.

## 3D / WebGL

Use at most one or two purposeful 3D scenes.

Good candidates:

- abstract infrastructure topology;
- GPU/compute field;
- spatial system diagram.

Requirements:

- lazy load;
- static fallback;
- disable/reduce on mobile or low capability;
- pause when hidden;
- never block content;
- no large 3D asset purely for decoration.

## Text animation

Text is a major part of the site.

Use:

- line reveals;
- word emphasis;
- mask transitions;
- controlled blur;
- letter tracking transitions.

Do not animate body paragraphs while the user is reading them.

## Page transitions

Transitions should preserve context.

Preferred:

- project thumbnail expands into case-study hero;
- article title / category can persist between list/detail;
- global nav stays stable.

Avoid full-screen transition animation on every tiny navigation action.

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- disable parallax;
- disable continuous loops;
- replace path animations with final state;
- replace large transforms with opacity or no animation;
- keep navigation immediate;
- make content fully understandable.

## Motion review checklist

For every animation ask:

1. What information does it communicate?
2. Does it improve spatial continuity or emotion?
3. Is it interruptible?
4. Is it smooth on a mid-range device?
5. Does it work without hover?
6. Does reduced motion preserve meaning?
7. Is it worth its JavaScript / rendering cost?


---

# SOURCE FILE: 07_CONTENT_AND_DATA_MODEL.md

# CONTENT AND DATA MODEL

## Principle

Biography and proof should be data, not hard-coded prose scattered across components.

## Recommended content structure

```text
content/
  profile.ts
  links.ts
  experience.ts
  education.ts
  achievements.ts
  skills.ts
  projects/
    project-slug.mdx
  writing/
    article-slug.mdx
  now.mdx
public/
  resume/
  images/
  diagrams/
```

## Profile schema

Recommended fields:

```ts
name
preferredName
headline
shortBio
longBio
locationPublic
availability
currentFocus[]
futureDirection[]
emailPublic
resumeUrl
portrait
status
lastVerified
```

## Experience schema

```ts
company
publicCompanyName
title
employmentType
startDate
endDate
location
summary
responsibilities[]
achievements[]
technologies[]
proofLinks[]
confidentialityNotes
status
lastVerified
```

Never make employer details public if the owner has not approved them.

## Skill schema

Do not store arbitrary percentages.

Use:

```ts
name
category
maturityLabel
claimType
summary
proof[]
currentlyLearning
featured
```

`claimType` options:

```text
CURRENT_STRENGTH
WORKING_KNOWLEDGE
EXPOSURE
LEARNING
FUTURE_DIRECTION
```

## Project front matter

```yaml
title:
slug:
summary:
status:
featured:
category:
role:
date:
technologies:
problem:
result:
confidentiality: public | sanitized | private
repoUrl:
demoUrl:
heroVisual:
```

## Blog front matter

```yaml
title:
slug:
description:
date:
updated:
tags:
category:
readingTime:
featured:
draft:
cover:
canonical:
```

## Achievement schema

Only verified achievements.

```ts
title
issuer
category
date
description
proofUrl
featured
```

## Education schema

```ts
institution
degree
field
startDate
endDate
status
notes
proofUrl
```

No education entry should be published until supplied/verified.

## Content status discipline

Every new fact should be tagged internally as one of:

- verified;
- draft;
- future;
- private.

## Last-verified dates

For dynamic professional facts, optionally track a `lastVerified` date.

This helps prevent an old current-role statement from remaining live for years.


---

# SOURCE FILE: 08_PROJECTS_AND_CASE_STUDIES.md

# PROJECTS AND CASE STUDIES

## Purpose

Projects are the core credibility layer of the site.

A case study should reveal reasoning, not just screenshots.

## Project hierarchy

Use approximately:

- 3–5 featured projects on home;
- 5–10 strong projects in the full portfolio over time;
- archive or omit weak tutorial projects.

## Candidate project themes from current trajectory

These must be published only with real verified details and sanitization.

### 1. Cause-Aware Monitoring Platform

Potential evidence:

- Prometheus;
- Grafana;
- Alertmanager;
- node/network exporters;
- service checks;
- alert-cause reasoning;
- failure simulation;
- validation.

### 2. Network Reliability / Multi-Network Connectivity

Potential evidence:

- routing;
- NAT;
- firewall behavior;
- path validation;
- dual ISP thinking;
- troubleshooting.

### 3. Backup and Recovery System

Potential evidence:

- backup strategy;
- validation;
- restore thinking;
- failure modes;
- documentation.

### 4. GPU Telemetry / Monitoring

Potential evidence:

- NVIDIA systems;
- DCGM;
- GPU metrics;
- observability;
- alerting.

Label as exposure or project scope accurately.

### 5. Application Delivery / Deployment

Potential evidence:

- frontend/backend deployment;
- Nginx;
- service operation;
- CI/CD;
- databases;
- validation / rollback.

### 6. Personal Website

The website itself can become a case study about:

- design system;
- motion architecture;
- performance;
- accessibility;
- content modeling;
- deployment;
- creative engineering.

## Case study structure

### 1. Hero

- project name;
- one-line outcome;
- role;
- time/context;
- technologies;
- confidentiality label.

### 2. Context

What environment/problem existed?

### 3. Problem

What was failing, missing, inefficient, or unclear?

### 4. Constraints

Examples:

- production safety;
- limited downtime;
- existing infrastructure;
- incomplete observability;
- network restrictions;
- time;
- cost.

### 5. Architecture

Use diagrams.

Explain flow.

### 6. Reasoning

What hypotheses or options existed?

Why was the chosen approach selected?

### 7. Implementation

Explain significant components only.

### 8. Failure / challenge

Show where things went wrong or were difficult.

This is often the most credible section.

### 9. Validation

How was success checked?

### 10. Outcome

Use real evidence.

Do not invent percentages.

### 11. Lessons

What changed in the owner's mental model or engineering behavior?

### 12. What I would improve next

Signals maturity and honesty.

## Confidentiality transform

Convert internal details into safe abstractions.

Example:

```text
192.168.x.x TMS host
→ Production Monitoring Host
```

```text
internal customer database
→ PostgreSQL Application Database
```

If sanitization would still reveal sensitive architecture, omit the detail.

## Visual storytelling

Each case study should get one signature visual language derived from the system.

Do not reuse the same generic laptop mockup.


---

# SOURCE FILE: 09_BLOG_AND_WRITING_SYSTEM.md

# BLOG AND WRITING SYSTEM

## Purpose

The blog is not an SEO content farm.

It is a public technical notebook that demonstrates understanding, communication, and professional growth.

## Editorial principle

Write from real understanding.

Preferred sequence:

LEARN
→ BUILD
→ BREAK
→ DEBUG
→ UNDERSTAND
→ DOCUMENT
→ PUBLISH

## Strong article types

### Troubleshooting story

Structure:

- symptom;
- evidence;
- wrong assumptions;
- investigation;
- root cause / best-supported cause;
- fix;
- verification;
- prevention.

### Architecture explainer

Structure:

- problem;
- requirements;
- architecture;
- data/network flow;
- failure modes;
- security;
- observability;
- trade-offs.

### Lab write-up

Structure:

- objective;
- setup;
- deliberate failure;
- diagnosis;
- recovery;
- lessons.

### Concept deep dive

Use:

WHAT
WHY
HOW
FAILURE
TRADE-OFF
REAL EXAMPLE

### Learning retrospective

Use only when it contains specific technical growth, not generic motivation.

## Article quality bar

A useful article should do at least one of:

- solve a real problem;
- explain a system clearly;
- show architecture;
- expose a failure mode;
- compare trade-offs;
- provide reproducible evidence;
- teach a troubleshooting method.

## Categories

Start with a small set:

- Infrastructure
- Networking
- Observability
- Reliability
- Cloud
- Platform
- AI Infrastructure

Add categories only when content exists.

## Publishing cadence

No forced daily posting.

Quality is more important than frequency.

A strong article every few weeks can be more valuable than frequent shallow posts.

## Content reuse

One serious project may produce:

- repository;
- README;
- case study;
- article;
- LinkedIn post;
- interview story;
- optional video.

Engineering remains the primary work.

## Code blocks

Code must be:

- readable;
- copyable;
- syntax-highlighted;
- horizontally scrollable on mobile;
- accompanied by explanation when non-trivial.

## Diagrams

Prefer first-party diagrams created for the article.

Use consistent visual grammar with portfolio case studies.

## RSS and sharing

Provide:

- RSS feed;
- canonical URLs;
- social metadata;
- copy-link control;
- good Open Graph image.

## Draft discipline

Draft articles should not ship accidentally.

Front matter must support `draft: true`.


---

# SOURCE FILE: 10_TECHNICAL_ARCHITECTURE.md

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


---

# SOURCE FILE: 11_SEO_PERFORMANCE_ACCESSIBILITY.md

# SEO, PERFORMANCE, AND ACCESSIBILITY

## Core rule

A spectacular site that is slow, inaccessible, or impossible to read is not spectacular engineering.

## SEO foundation

Every route needs:

- unique title;
- description;
- canonical URL;
- Open Graph metadata;
- Twitter/social metadata;
- semantic heading structure.

Generate:

- sitemap;
- robots rules;
- RSS feed;
- structured data where appropriate.

## Structured data

Consider:

- `Person` for public professional profile;
- `Article` / `BlogPosting` for writing;
- `BreadcrumbList` for deep pages.

Do not include private data in structured markup.

## Search strategy

Search discoverability should emerge from strong technical content.

Use clear titles such as:

- Prometheus Cause-Aware Alerting
- Kubernetes GPU Scheduling Lab
- Terraform Production AWS Architecture

Avoid clickbait.

## Performance principles

### Critical

- server-render core content;
- lazy-load 3D;
- dynamic import heavy interactive sections;
- minimize layout shift;
- limit continuous animation;
- avoid excessive blur/filter layers;
- compress media;
- avoid shipping unused libraries.

### Animation performance

Prefer:

- transform;
- opacity;
- SVG stroke/path where efficient.

Be cautious with:

- large blur radii;
- backdrop-filter on many elements;
- animating layout properties continuously;
- giant fixed canvases;
- multiple WebGL scenes.

## Device tiers

Design capability fallbacks.

### High capability desktop

Full signature animation.

### Standard desktop/laptop

Same narrative with lighter 3D/particle density.

### Mobile

Reduced depth, no hover dependence, lighter assets.

### Reduced motion

Minimal or no non-essential movement.

## Accessibility requirements

- semantic HTML;
- correct landmark regions;
- one logical H1 per page;
- keyboard navigation;
- focus-visible styling;
- descriptive link text;
- accessible menu behavior;
- image alt text;
- labeled forms;
- error messaging;
- sufficient contrast;
- motion reduction;
- no content hidden behind hover only.

## Reading accessibility

Blog and case studies should use:

- comfortable measure;
- generous line height;
- strong heading hierarchy;
- code block overflow;
- clear captions;
- accessible footnotes if used.

## Testing

Before launch, manually test:

- Chrome;
- Safari;
- Firefox;
- mobile Safari;
- mobile Chrome;
- keyboard-only navigation;
- reduced-motion setting;
- slow network;
- mid-range mobile device.

Automated audits are helpful but not sufficient.


---

# SOURCE FILE: 12_BUILD_ROADMAP.md

# BUILD ROADMAP

## Phase 0 — Truth and content inventory

### Deliverables

- verified name and public identity;
- public email;
- GitHub / LinkedIn links;
- education details;
- experience details;
- resume;
- 3–5 project candidates;
- portrait decision;
- first 2–3 article candidates.

### Exit criteria

No critical biography on the site depends on invention.

## Phase 1 — Creative direction

### Work

Create 3 compact visual directions.

Recommended directions:

1. Infrastructure Noir — recommended default.
2. Editorial Systems — lighter, more typography-led.
3. Spatial Compute — stronger 3D / experimental direction.

### Prototype only

- hero;
- one project section;
- nav;
- typography system;
- core motion tokens.

### Exit criteria

One visual language is selected before building the whole site.

## Phase 2 — Foundation

Build:

- repo setup;
- app shell;
- routing;
- typography;
- tokens;
- responsive grid;
- content schemas;
- metadata;
- base animation primitives;
- reduced-motion system.

### Exit criteria

A plain unanimated version of all core routes can render correctly.

## Phase 3 — Home V1

Build in this order:

1. nav;
2. hero;
3. selected work;
4. focus/system map;
5. journey;
6. writing teaser;
7. final CTA;
8. footer.

Do not begin with WebGL.

### Exit criteria

Homepage tells the complete story before signature animation is added.

## Phase 4 — Work / case studies

Build reusable case-study template.

Publish at least two serious case studies before launch if enough verified material exists.

### Exit criteria

Each featured project has a destination deeper than a card.

## Phase 5 — Writing system

Build:

- MDX pipeline;
- article index;
- article layout;
- tags/categories;
- code blocks;
- diagram support;
- RSS;
- metadata.

Publish at least one strong article if ready.

## Phase 6 — About / Journey / Resume / Contact

Keep these content-first.

Do not over-animate resume/contact.

## Phase 7 — Signature motion pass

Only now add:

- hero topology;
- shared project transitions;
- scroll choreography;
- system map interactions;
- cursor enhancements;
- optional 3D.

### Exit criteria

Every effect has a fallback and measurable performance cost.

## Phase 8 — Quality pass

Review:

- mobile;
- tablet;
- large desktop;
- keyboard;
- reduced motion;
- loading;
- broken links;
- metadata;
- image sizes;
- console errors;
- hydration warnings;
- animation jank.

## Phase 9 — Launch

- production domain;
- HTTPS;
- analytics;
- sitemap;
- search console when desired;
- social previews;
- final resume link;
- contact verification.

## Phase 10 — Post-launch evolution

After launch:

- add one case study at a time;
- publish writing from real work;
- refine animations based on performance;
- update current role/focus;
- improve search visibility;
- maintain content freshness.

## Scope discipline

V1 should not wait for:

- perfect 3D scene;
- 20 articles;
- custom CMS;
- guestbook;
- authentication;
- fancy admin dashboard;
- all career history.

Launch a strong, coherent V1 and evolve it.


---

# SOURCE FILE: 13_LAUNCH_AND_MAINTENANCE.md

# LAUNCH AND MAINTENANCE

## Launch checklist

### Identity

- name correct;
- headline correct;
- current role wording verified;
- aspirations clearly labeled;
- no exaggerated expertise;
- public location decision approved.

### Links

- GitHub;
- LinkedIn;
- email;
- resume;
- project repositories;
- demos;
- article links.

### Confidentiality

Review every project for:

- IP addresses;
- hostnames;
- credentials;
- customer data;
- company-only screenshots;
- private repository names;
- security-sensitive architecture;
- proprietary code.

### Technical

- no console errors;
- no broken routes;
- no missing images;
- no hydration warnings;
- sitemap valid;
- social cards render;
- contact works;
- resume downloads;
- custom 404;
- metadata complete.

### Motion

- no major dropped frames;
- no scroll locking bugs;
- mobile fallbacks;
- reduced-motion mode;
- tab visibility pauses continuous effects.

### Accessibility

- keyboard navigation;
- focus states;
- labels;
- alt text;
- contrast;
- heading structure;
- menu semantics.

## Maintenance cadence

### Monthly

- update current focus if materially changed;
- check broken links;
- review latest writing/project state;
- check analytics lightly;
- review dependency/security updates.

### Quarterly

- update role/profile if needed;
- replace weak featured work with stronger work;
- review resume;
- review homepage positioning;
- review search visibility;
- review performance.

### Before active job search

Increase emphasis on:

- strongest relevant projects;
- resume;
- current role targeting;
- case studies;
- recruiter clarity;
- contact path.

## Content freshness rules

Do not leave:

- “currently learning X” unchanged for years;
- old resume links;
- outdated role descriptions;
- broken demos;
- claims based on obsolete evidence.

## Analytics interpretation

Meaningful signals:

- project detail views;
- article engagement;
- resume clicks;
- contact actions;
- inbound recruiter references to specific work.

Do not over-optimize:

- raw pageviews;
- vanity counters;
- animation interaction count.

## Website quality scoreboard

Periodically evaluate:

```text
Positioning clarity
Proof quality
Project depth
Case-study clarity
Writing quality
Visual coherence
Motion quality
Performance
Accessibility
Mobile quality
SEO foundation
Content freshness
Recruiter usability
```

The goal is a useful professional asset, not a trophy page.


---

# SOURCE FILE: 14_CONTENT_GAPS_TO_FILL.md

# CONTENT GAPS TO FILL

## Purpose

These facts were not sufficiently verified in the available project context and must not be invented by Codex.

Fill this file before final public launch.

## Personal identity

```text
FULL PUBLIC NAME:
PREFERRED DISPLAY NAME:
PRONUNCIATION (optional):
PUBLIC LOCATION:
PUBLIC EMAIL:
PROFILE PHOTO:
```

## Professional links

```text
GITHUB:
LINKEDIN:
YOUTUBE (optional):
X / OTHER (optional):
CURRENT DOMAIN:
```

## Current role

```text
CURRENT COMPANY / PUBLIC COMPANY NAME:
OFFICIAL TITLE:
PREFERRED ACCURATE PUBLIC TITLE:
EMPLOYMENT TYPE:
START DATE:
LOCATION / REMOTE STATUS:
ONE-PARAGRAPH ROLE SUMMARY:
```

## Education

```text
INSTITUTION:
DEGREE:
FIELD / BRANCH:
START YEAR:
END YEAR / EXPECTED END:
GPA / PERCENTAGE (only if desired):
RELEVANT ACTIVITIES:
```

## Resume

```text
LATEST RESUME FILE:
RESUME LAST UPDATED:
PUBLIC DOWNLOAD ALLOWED: YES / NO
```

## Achievements

For each:

```text
TITLE:
ISSUER / ORGANIZATION:
DATE:
WHY IT MATTERS:
PUBLIC PROOF URL:
```

Do not list an achievement without evidence or direct confirmation.

## Certifications

```text
CERTIFICATION:
ISSUER:
DATE:
CREDENTIAL URL:
STATUS:
```

## Featured projects

For each candidate:

```text
PROJECT NAME:
PUBLIC OR SANITIZED:
MY EXACT CONTRIBUTION:
PROBLEM:
CONSTRAINTS:
ARCHITECTURE:
TECHNOLOGIES:
MOST DIFFICULT PART:
FAILURE / INCIDENT:
RESULT:
HOW RESULT WAS VERIFIED:
WHAT I LEARNED:
PUBLIC CODE:
PUBLIC DEMO:
SAFE SCREENSHOTS / DIAGRAMS:
```

## Blog seed list

Write 5 article titles based on real work.

```text
1.
2.
3.
4.
5.
```

## Personal story

Optional but useful:

```text
WHY INFRASTRUCTURE / SYSTEMS INTERESTS ME:
WHAT KIND OF PROBLEMS I ENJOY:
WHAT I WANT TO BECOME KNOWN FOR:
WHAT I AM CURRENTLY TRYING TO GET BETTER AT:
WHAT I DO OUTSIDE ENGINEERING (only if public):
```

## Visual preferences

```text
PRIMARY COLOR DIRECTION:
PORTRAIT STYLE:
LIGHT / DARK / MIXED:
SITES I LOVE:
SITES I DISLIKE:
MOTION REFERENCES:
```

## Contact preferences

```text
PUBLIC EMAIL:
CONTACT FORM: YES / NO
RECRUITER CONTACT WELCOME: YES / NO
FREELANCE / CONSULTING WELCOME: YES / NO
COLLABORATION WELCOME: YES / NO
```
