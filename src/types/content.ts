export type ContentStatus =
  | "VERIFIED_CURRENT"
  | "VERIFIED_PAST"
  | "ASPIRATION"
  | "LEARNING_NOW"
  | "DRAFT"
  | "PRIVATE_DO_NOT_PUBLISH";
export type ContentField<T> = {
  value: T | null;
  status: ContentStatus;
  approvedForPublication: boolean;
  lastVerified: string | null;
};
export type PublicProfile = {
  name: ContentField<string>;
  displayName: ContentField<string>;
  phone: ContentField<string>;
  headline: ContentField<string>;
  email: ContentField<string>;
  availability: ContentField<string>;
  location: ContentField<string>;
  timezone: ContentField<string>;
  github: ContentField<string>;
  linkedin: ContentField<string>;
  bluesky: ContentField<string>;
};
