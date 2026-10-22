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
