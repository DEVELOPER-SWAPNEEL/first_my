export type SiteRoute = {
  path: string;
  label: string;
  parent: string | null;
  mappingIdentifier: boolean;
};
export const routes: SiteRoute[] = [
  {
    path: "/",
    label: "Home",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/about",
    label: "About",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/contact",
    label: "Contact",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/cookies",
    label: "Cookies",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/faq",
    label: "FAQ",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/lab",
    label: "Lab",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/lab/a11y-probe",
    label: "Unfinished lab entry 01",
    parent: "/lab",
    mappingIdentifier: true,
  },
  {
    path: "/lab/glyphfield",
    label: "Unfinished lab entry 02",
    parent: "/lab",
    mappingIdentifier: true,
  },
  {
    path: "/lab/shader-notes",
    label: "Unfinished lab entry 03",
    parent: "/lab",
    mappingIdentifier: true,
  },
  {
    path: "/lab/tinyflip",
    label: "Unfinished lab entry 04",
    parent: "/lab",
    mappingIdentifier: true,
  },
  {
    path: "/lab/tokens-to-css",
    label: "Unfinished lab entry 05",
    parent: "/lab",
    mappingIdentifier: true,
  },
  {
    path: "/lab/use-latency",
    label: "Unfinished lab entry 06",
    parent: "/lab",
    mappingIdentifier: true,
  },
  {
    path: "/now",
    label: "Now",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/privacy",
    label: "Privacy",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/process",
    label: "Process",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/resume",
    label: "Resume",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/reviews",
    label: "Reviews",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/services",
    label: "Services",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/services/design-system",
    label: "Unfinished service 01",
    parent: "/services",
    mappingIdentifier: true,
  },
  {
    path: "/services/frontend-build",
    label: "Unfinished service 02",
    parent: "/services",
    mappingIdentifier: true,
  },
  {
    path: "/services/performance-audit",
    label: "Unfinished service 03",
    parent: "/services",
    mappingIdentifier: true,
  },
  {
    path: "/services/team-embed",
    label: "Unfinished service 04",
    parent: "/services",
    mappingIdentifier: true,
  },
  {
    path: "/stack",
    label: "Stack",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/terms",
    label: "Terms",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/uses",
    label: "Uses",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/work",
    label: "Work",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/work/brattvik-onboarding",
    label: "Unfinished case 01",
    parent: "/work",
    mappingIdentifier: true,
  },
  {
    path: "/work/halden-design-system",
    label: "Unfinished case 02",
    parent: "/work",
    mappingIdentifier: true,
  },
  {
    path: "/work/kestrel-pay-dashboard",
    label: "Unfinished case 03",
    parent: "/work",
    mappingIdentifier: true,
  },
  {
    path: "/work/ledgerline-console",
    label: "Unfinished case 04",
    parent: "/work",
    mappingIdentifier: true,
  },
  {
    path: "/work/loopdocs",
    label: "Unfinished case 05",
    parent: "/work",
    mappingIdentifier: true,
  },
  {
    path: "/work/northwind-checkout",
    label: "Unfinished case 06",
    parent: "/work",
    mappingIdentifier: true,
  },
  {
    path: "/work/parcelway-tracking",
    label: "Unfinished case 07",
    parent: "/work",
    mappingIdentifier: true,
  },
  {
    path: "/work/tidewater-charts",
    label: "Unfinished case 08",
    parent: "/work",
    mappingIdentifier: true,
  },
  {
    path: "/writing",
    label: "Writing",
    parent: null,
    mappingIdentifier: false,
  },
  {
    path: "/writing/an-inp-budget-you-can-keep",
    label: "Unfinished article 01",
    parent: "/writing",
    mappingIdentifier: true,
  },
  {
    path: "/writing/code-review-is-writing",
    label: "Unfinished article 02",
    parent: "/writing",
    mappingIdentifier: true,
  },
  {
    path: "/writing/estimates-that-hold",
    label: "Unfinished article 03",
    parent: "/writing",
    mappingIdentifier: true,
  },
  {
    path: "/writing/server-components-after-a-year",
    label: "Unfinished article 04",
    parent: "/writing",
    mappingIdentifier: true,
  },
  {
    path: "/writing/the-last-hundred-milliseconds",
    label: "Unfinished article 05",
    parent: "/writing",
    mappingIdentifier: true,
  },
  {
    path: "/writing/what-a-design-system-is-for",
    label: "Unfinished article 06",
    parent: "/writing",
    mappingIdentifier: true,
  },
];
export const mainNavigation = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Work areas" },
  { href: "/about", label: "About" },
  { href: "/lab", label: "Lab" },
  { href: "/writing", label: "Writing" },
];
export const moreNavigation = [
  { href: "/stack", label: "Stack" },
  { href: "/uses", label: "Uses" },
  { href: "/now", label: "Now" },
  { href: "/process", label: "Process" },
  { href: "/resume", label: "Resume" },
  { href: "/reviews", label: "Working notes" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];
export const footerNavigation = [
  {
    label: "Site",
    items: [
      { href: "/work", label: "Work" },
      { href: "/services", label: "Work areas" },
      { href: "/process", label: "Process" },
      { href: "/reviews", label: "Working notes" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "About",
    items: [
      { href: "/about", label: "About" },
      { href: "/resume", label: "Resume" },
      { href: "/stack", label: "Stack" },
      { href: "/uses", label: "Uses" },
      { href: "/now", label: "Now" },
    ],
  },
  {
    label: "More",
    items: [
      { href: "/lab", label: "Lab" },
      { href: "/writing", label: "Writing" },
      { href: "/faq", label: "FAQ" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];
