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
