import { ownerContact } from "../content/profile.ts";
// Fixed recipient and parameter keys: user text can only enter the encoded body.
export function contactMailto(
  opportunity: string | null,
  topic: string | null,
  message: string,
): string {
  const query = new URLSearchParams({
    subject: "Website enquiry",
    body: `Hello Swapneel,\n\nOpportunity: ${opportunity || "Not selected"}\nTopic: ${topic || "Not selected"}\n\n${message.trim().slice(0, 1000)}`,
  });
  return `mailto:${ownerContact.email}?${query.toString()}`;
}
