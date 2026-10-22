import type { ContentField, PublicProfile } from "../types/content";
const confirmed = (value: string): ContentField<string> => ({
  value,
  status: "VERIFIED_CURRENT",
  approvedForPublication: true,
  lastVerified: "2026-10-14",
});
const pending = (): ContentField<string> => ({
  value: null,
  status: "DRAFT",
  approvedForPublication: false,
  lastVerified: null,
});
// Owner-approved identity/contact facts. This approval does not authorize launching the site.
export const profile: PublicProfile = {
  name: confirmed("Swapneel Purohit"),
  displayName: confirmed("Swapneel"),
  headline: confirmed("AI Infrastructure & Cloud Intern"),
  email: confirmed("rsnikupurohit17@gmail.com"),
  phone: confirmed("+91 6371819343"),
  availability: confirmed("Open to opportunities and collaboration."),
  location: confirmed("Bengaluru, Karnataka, India"),
  timezone: confirmed("Asia/Kolkata"),
  github: confirmed("https://github.com/DEVELOPER-SWAPNEEL/"),
  linkedin: confirmed("https://www.linkedin.com/in/swapneel-purohit/"),
  bluesky: pending(),
};
export const ownerContact = {
  email: "rsnikupurohit17@gmail.com",
  phone: "+91 6371819343",
  telephoneUri: "tel:+916371819343",
  responseIntention: "I aim to reply within five hours.",
  resume: "/downloads/Swapneel-Purohit-Resume.pdf",
  resumeVersion: "9 September 2026 · owner-reported version",
};
export const draftLabels = {
  name: "Draft Name",
  headline: "Profile pending",
  email: "Contact pending",
  availability: "Availability pending",
  location: "Location pending",
  timezone: "Time zone pending",
};
