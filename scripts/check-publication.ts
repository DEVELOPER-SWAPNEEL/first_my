import { profile } from "../src/content/profile.ts";
const unresolved = Object.entries(profile).filter(
  ([, field]) =>
    field.value === null ||
    field.status === "DRAFT" ||
    field.status === "PRIVATE_DO_NOT_PUBLISH" ||
    !field.approvedForPublication,
);
console.error(
  "Publication is blocked: unfinished routes and unapproved editorial / employer-disclosure content remain.",
);
console.error(
  "Unresolved profile fields:",
  unresolved.map(([name]) => name).join(", "),
);
process.exitCode = 1;
