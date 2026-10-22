import type { ContentField } from "../types/content";
// Profile fact accessors exclude private/draft fields; editorial preview copy is separate.
export function publishedValue<T>(field: ContentField<T>): T | null {
  if (
    field.status === "DRAFT" ||
    field.status === "PRIVATE_DO_NOT_PUBLISH" ||
    !field.approvedForPublication
  )
    return null;
  return field.value;
}
export function currentFact<T>(field: ContentField<T>): T | null {
  if (field.status !== "VERIFIED_CURRENT" && field.status !== "VERIFIED_PAST")
    return null;
  return publishedValue(field);
}
