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
