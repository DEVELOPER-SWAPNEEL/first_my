// Sanitized editorial drafts for local review. No private source text or infrastructure identifiers.
export const workEvidence = [
  {
    id: "launchops",
    intendedSlug: "launchops",
    category: "Personal lab · AI-assisted",
    period: "In progress · October 2026",
    title: "LaunchOps",
    description:
      "A deployment-and-recovery lab built around a small support-ticket application.",
    credit: "Personal learning project · independent capability not assessed",
    evidence: "Local API + SQLite",
    boundary:
      "Nine SQLite-backed tests and a local HTTP transaction check are recorded as passing. Containers are prepared, not runtime-verified.",
    implemented: [
      "Ticket create / retrieve / status update",
      "SQLite persistence and input validation",
      "Liveness and readiness endpoints",
    ],
    prepared: ["Dockerfile", "PostgreSQL Compose configuration"],
    planned: [
      "AWS / Terraform",
      "CI/CD",
      "Observability",
      "Restore and rollback drills",
    ],
    tags: ["FastAPI", "SQLite", "Python"],
    sourceIds: ["L1", "L2", "L3"],
    diagram: ["Browser", "FastAPI", "SQLite"],
    diagramNote: "Implemented locally · containers and delivery planned",
    href: undefined,
  },
  {
    id: "workload-migration",
    intendedSlug: "aws-to-on-premises",
    category: "Employer work · abstract draft",
    period: "Historical report · August 2026",
    title: "Workload migration",
    description:
      "Worked on relocating application workloads and restoring infrastructure services from AWS to an on-premises environment.",
    credit:
      "Team contribution · individual responsibility awaits reconciliation",
    evidence: "Workload relocation",
    boundary:
      "Retained cloud dependencies remain. This is not a claim of complete AWS exit, zero downtime or measured savings.",
    implemented: [
      "Application workload relocation documented",
      "Infrastructure services restored in source report",
    ],
    prepared: [],
    planned: [
      "Individual contribution reconciliation",
      "Employer disclosure review",
    ],
    tags: ["Linux", "AWS", "Nginx", "PM2"],
    sourceIds: ["M1", "B1"],
    diagram: ["Cloud workloads", "Relocation", "On-premises"],
    diagramNote: "Illustration · retained cloud dependencies not shown",
    href: undefined,
  },
  {
    id: "observability",
    intendedSlug: "infrastructure-observability",
    category: "Employer work · abstract draft",
    period: "Evidence spans June–October 2026",
    title: "Infrastructure observability",
    description:
      "Work across host metrics, dashboards and alert routing, with deployment stages kept separate from plans and owner reports.",
    credit: "Contribution scope and rollout acceptance remain under review",
    evidence: "Metrics and dashboards",
    boundary:
      "The monitoring document records Prometheus → Alertmanager setup. Notification delivery and dashboard totals are not independently verified.",
    implemented: [
      "Host metrics documented in August",
      "Alert routing setup reported in monitoring document",
    ],
    prepared: [],
    planned: [
      "Notification-delivery evidence",
      "Dashboard scope and rollout reconciliation",
    ],
    tags: ["Prometheus", "Grafana", "Node Exporter", "Alertmanager"],
    sourceIds: ["M1", "O1", "U1"],
    diagram: ["Host signals", "Metrics", "Dashboards"],
    diagramNote: "Illustrative telemetry flow · not a dashboard capture",
    href: undefined,
  },
  {
    id: "networking",
    intendedSlug: "networking-remote-administration",
    category: "Employer work · owner-reported",
    period: "Owner report · October 2026",
    title: "Networking & remote access",
    description:
      "Owner-reported work on dual-ISP Omada configuration, routing, remote administration and workstation/server connectivity.",
    credit: "Owner report · later changes require specific evidence",
    evidence: "Configuration work",
    boundary:
      "No tested seamless failover, throughput gain or high-availability result is claimed.",
    implemented: ["Configuration and remote-access work owner-reported"],
    prepared: [],
    planned: [
      "Dated configuration / validation evidence",
      "Contribution and disclosure review",
    ],
    tags: ["Omada", "Linux", "SSH"],
    sourceIds: ["U1", "R1"],
    diagram: ["ISP A / ISP B", "Gateway", "Host"],
    diagramNote: "Abstract illustration · failover unverified",
    href: undefined,
  },
  {
    id: "ai-sales-assistant",
    intendedSlug: "ai-sales-support-assistant",
    category: "Public repository candidate",
    period: "Source reviewed · 14 October 2026",
    title: "AI Sales Support Assistant",
    description:
      "A public repository with retrieval, memory, routing and a Streamlit interface. Source review is separate from runtime verification.",
    credit:
      "Repository under supplied account · individual authorship not independently established",
    evidence: "Source present",
    boundary:
      "Tests are present but were not run here. Commercial use, deployment and production readiness are unverified.",
    implemented: [
      "Retrieval / memory / routing source present",
      "Streamlit UI and test source present",
    ],
    prepared: [],
    planned: ["Runtime checks", "Contribution reconciliation"],
    tags: ["Python", "LangGraph", "ChromaDB", "Streamlit"],
    sourceIds: ["G1"],
    diagram: ["Documents", "Retrieval", "Chat UI"],
    diagramNote: "Source-based illustration · runtime not verified",
    href: "https://github.com/DEVELOPER-SWAPNEEL/AI-Sales-Support-Assistant-for-E-commerce-Brands",
  },
] as const;
