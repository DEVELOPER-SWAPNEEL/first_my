import { workEvidence } from "./work-evidence.ts";
export type DraftFixture = {
  status: "DRAFT";
  approvedForPublication: false;
  title: string;
  description: string;
  href?: string;
  usage?: string;
  detail?: string;
  tags?: readonly string[];
  period?: string;
  organization?: string;
};
const fixture = (
  title: string,
  description: string,
  href?: string,
): DraftFixture => ({
  status: "DRAFT",
  approvedForPublication: false,
  title,
  description,
  href,
});
export const sectionOrder = [
  "hero",
  "clients",
  "work",
  "about",
  "scores",
  "stack",
  "services",
  "career",
  "lab",
  "reviews",
  "writing",
  "faq",
  "brief",
] as const;
export const homeDraft = {
  status: "DRAFT" as const,
  approvedForPublication: false as const,
  notice: "Unpublished local preview · Copy and section mapping under review",
  heroLines: ["I build the systems", "behind reliable", "software."],
  hero: fixture(
    "I build the systems behind reliable software.",
    "I’m Swapneel, an AI Infrastructure & Cloud Intern at BigWings in Bengaluru. My work spans infrastructure and backend systems. Alongside it, I’m building LaunchOps, a deployment-and-recovery lab.",
  ),
  professionalHeadline: "Infrastructure & Cloud Intern · Backend Developer",
  clients: [
    "Infrastructure",
    "Linux",
    "Cloud",
    "Networking",
    "Observability",
    "Backend",
    "Deployment",
    "Recovery",
  ],
  heroStats: [
    { value: "BigWings", label: "Current employer" },
    { value: "Bengaluru", label: "Based in India" },
    { value: "LaunchOps", label: "Personal lab · in progress" },
  ],
  now: [
    { label: "Working on", value: "Infrastructure and observability" },
    { label: "Building", value: "LaunchOps · local lab" },
    { label: "Learning", value: "Container and recovery workflows" },
    { label: "Based in", value: "Bengaluru · IST" },
  ],
  headings: {
    work: fixture(
      "Systems work, with its boundaries.",
      "LaunchOps, three employer work areas and a public repository candidate. These are sanitized editorial drafts; contribution, disclosure and runtime limits stay visible.",
    ),
    about: fixture(
      "I’m Swapneel, an AI Infrastructure & Cloud Intern at BigWings in Bengaluru. My work spans Linux servers, cloud-to-on-premises migration, networking, observability, and backend systems. Alongside that work, I’m building LaunchOps, a deployment-and-recovery lab.",
      "Draft biography grounded in supplied profile and evidence.",
    ),
    scores: fixture(
      "Work areas, not arbitrary scores.",
      "Four areas organize this preview. The labels describe work and evidence status, not ratings, proficiency or measured impact.",
    ),
    stack: fixture(
      "Tools, with context attached.",
      "Work use, documented exposure, owner reports and local learning are different kinds of evidence. Select a key for that context; no years or proficiency percentages are implied.",
    ),
    services: fixture(
      "Areas of engineering work.",
      "A proposed replacement for the template’s service menu. These draft descriptions summarize work and learning, with no rates or consulting promises.",
    ),
    career: fixture(
      "Experience, with dates attached.",
      "The current role, a resume-reported contribution and ongoing study. Additional roles, attribution and certification titles need reconciliation before expansion.",
    ),
    lab: fixture(
      "Lab previews, clearly marked.",
      "These six local demo slots preserve the reference rail. They are not additional completed projects, repositories or releases.",
    ),
    reviews: fixture(
      "Working notes, open for review.",
      "Proposed principles for explaining the work. These are editorial drafts, not quotations, testimonials or endorsements.",
    ),
    writing: fixture(
      "Writing is still taking shape.",
      "Local layout previews only. No published article, publication date, audience or reading-time claim is made.",
    ),
    faq: fixture(
      "A little more context.",
      "Draft answers drawn from the supplied profile and evidence. Work boundaries and ongoing learning remain explicit.",
    ),
    brief: fixture(
      "Let’s start a conversation.",
      "Choose an opportunity and topic, then open your email app with an editable draft. This page does not send messages or store your selections.",
    ),
  },
  work: workEvidence.map((item) => ({
    ...fixture(item.title, item.description, item.href),
    ...item,
    status: "DRAFT" as const,
    approvedForPublication: false as const,
  })),
  tools: [
    [
      "Linux",
      "Work use · resume + migration report",
      "Linux server administration is described in the resume and historical migration report. Individual task attribution remains bounded.",
    ],
    [
      "SSH",
      "Work use · resume / owner report",
      "Remote administration appears in the resume and owner report. No access configuration or infrastructure identifiers are disclosed.",
    ],
    [
      "Nginx",
      "Documented exposure · migration report",
      "The historical report describes application routing with Nginx. No live architecture or current configuration is asserted here.",
    ],
    [
      "systemd",
      "Documented exposure · migration report",
      "The historical report describes systemd Quadlet-managed monitoring services. This is not a proficiency rating.",
    ],
    [
      "AWS",
      "Work use · resume + historical baseline",
      "The resume describes AWS and workload migration. Historical resource inventories do not establish complete cloud exit or current resource state.",
    ],
    [
      "Podman",
      "Documented exposure · migration report",
      "The migration report describes a Podman-based metrics stack. Individual responsibility still requires reconciliation.",
    ],
    [
      "Docker",
      "Work use reported / local learning",
      "Docker is listed in the resume. LaunchOps configuration is prepared; its container runtime is not yet verified.",
    ],
    [
      "Omada",
      "Owner-reported work",
      "The owner reports dual-ISP configuration and routing work. Seamless failover and performance improvements are not verified.",
    ],
    [
      "Prometheus",
      "Work use · monitoring documents",
      "Host metrics and later alert-routing setup are documented at different stages. Complete monitoring coverage is not claimed.",
    ],
    [
      "Grafana",
      "Work use · resume + documents",
      "Dashboard work is supported at an abstract level. Screenshot access, dashboard totals, query behavior and rollout acceptance remain unresolved.",
    ],
    [
      "Node Exporter",
      "Documented work use",
      "Host metrics collection is documented. This does not establish application-level or per-GPU attribution.",
    ],
    [
      "Alertmanager",
      "Setup reported · monitoring document",
      "The monitoring document says Prometheus → Alertmanager is set up. Email and Teams are described there as planned; later delivery evidence is pending.",
    ],
    [
      "FastAPI",
      "Local implementation · AI-assisted",
      "LaunchOps records a ticket API, validation and health/readiness endpoints. Independent learner capability has not been assessed.",
    ],
    [
      "SQLite",
      "Local runtime verified in project records",
      "LaunchOps records persistence tests and local HTTP checks. These do not prove PostgreSQL or container behavior.",
    ],
    [
      "PostgreSQL",
      "Documented exposure / prepared lab runtime",
      "Restoration is described in historical employer evidence. LaunchOps Compose configuration is prepared, not runtime-verified.",
    ],
    [
      "Python",
      "Local learning / source present",
      "Python is used in the AI-assisted LaunchOps application and the reviewed public repository. No independent proficiency level is asserted.",
    ],
  ].map(([title, usage, description]) => ({
    ...fixture(title, description),
    usage,
  })),
  toolGroups: [
    "Systems",
    "Cloud / containers",
    "Observability",
    "Backend / lab",
  ],
  services: workEvidence
    .slice(0, 4)
    .map((item) => ({
      ...fixture(item.title, item.description),
      detail: item.boundary,
      tags: item.tags,
      usage: item.category,
    })),
  career: [
    {
      ...fixture(
        "AI Infrastructure & Cloud Intern",
        "Current role at BigWings. Infrastructure, migration, observability and remote-administration work are described in the supplied materials; individual contribution boundaries remain visible in the work drafts.",
      ),
      period: "May 2026–Present",
      organization: "BigWings LLC · Bengaluru",
      usage: "Owner-confirmed role",
      tags: ["Infrastructure", "Cloud", "Observability"],
    },
    {
      ...fixture(
        "Backend & system integration contribution",
        "The resume lists work on EasyQR for Bliski. The linked organization repository contains source; precise contribution and collaborator credit still need reconciliation.",
      ),
      period: "October 2025–February 2026",
      organization: "Bliski · resume-reported",
      usage: "Scope under review",
      tags: ["Backend", "Integration"],
    },
    {
      ...fixture(
        "B.Tech studies · in progress",
        "Computer Science and System Engineering at Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar. The resume lists 2023–2027; this is ongoing study, not a completed degree.",
      ),
      period: "2023–2027 · ongoing",
      organization: "KIIT · Bhubaneswar",
      usage: "Resume-supplied education",
      tags: ["Ongoing study"],
    },
  ],
  lab: [
    "use-latency",
    "glyphfield",
    "tinyflip",
    "a11y-probe",
    "tokens-to-css",
    "shader-notes",
  ].map((slug, i) =>
    fixture(
      `Local demo slot ${String(i + 1).padStart(2, "0")}`,
      "Layout preview only. No project implementation, release or repository statistics are claimed.",
      `/lab/${slug}`,
    ),
  ),
  reviews: [
    [
      "Keep evidence close",
      "Explain what was implemented, what was observed and what is still planned.",
    ],
    [
      "Make boundaries visible",
      "Separate a local check from a production result, and a team contribution from sole ownership.",
    ],
    [
      "Protect private systems",
      "Use sanitized abstractions instead of exposing employer configurations or operational data.",
    ],
    [
      "Learn through verification",
      "Use small runtime checks and repeatable exercises to assess capability over time.",
    ],
    [
      "Prefer readable records",
      "Record decisions, limitations and next steps so another person can follow the work.",
    ],
  ].map(([title, description]) => fixture(title, description)),
  writing: [
    "the-last-hundred-milliseconds",
    "what-a-design-system-is-for",
    "an-inp-budget-you-can-keep",
    "code-review-is-writing",
    "server-components-after-a-year",
  ].map((slug, i) =>
    fixture(
      `Writing preview ${String(i + 1).padStart(2, "0")}`,
      "Local editorial layout preview. A real article and its publication metadata have not been supplied.",
      `/writing/${slug}`,
    ),
  ),
  faq: [
    [
      "What are you working on?",
      "I’m an AI Infrastructure & Cloud Intern at BigWings in Bengaluru. My current focus is infrastructure, observability and repeatable deployment workflows.",
    ],
    [
      "What is LaunchOps?",
      "A personal deployment-and-recovery lab around a small support-ticket application. Its implementation is AI-assisted, and independent learner capability is still being assessed.",
    ],
    [
      "What works in LaunchOps today?",
      "Project records dated 14 October 2026 show a local FastAPI / SQLite application, nine passing SQLite-backed tests and a passing HTTP transaction check. These checks were recorded in that project, not rerun by this website task.",
    ],
    [
      "What is still planned?",
      "Containers are prepared but not runtime-verified. AWS/Terraform, CI/CD, observability, backup restoration and rollback drills are upcoming. Kubernetes/GitOps work is a later plan.",
    ],
    [
      "How should I read the employer work?",
      "As sanitized contribution drafts. The migration report is historical and confidential; exact individual responsibility, current rollout state and public disclosure require reconciliation.",
    ],
    [
      "Are you open to opportunities?",
      "I’m open to opportunities and collaboration. This does not specify a notice period, immediate start date or an established freelance service.",
    ],
    [
      "Where are you based?",
      "Bengaluru, Karnataka, India. My public timezone is Asia/Kolkata (IST).",
    ],
    [
      "What is the best way to reach you?",
      "Email or the approved phone link below. I aim to reply within five hours; this is an intention, not a measured response guarantee. The brief only opens an email composer.",
    ],
  ].map(([title, description]) => fixture(title, description)),
  briefKinds: [
    "Employment",
    "Internship",
    "Collaboration",
    "Project discussion",
    "Other",
  ],
  briefTopics: [
    "Infrastructure",
    "Backend",
    "Observability",
    "LaunchOps",
    "General",
  ],
};
