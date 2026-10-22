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
