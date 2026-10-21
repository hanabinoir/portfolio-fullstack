/**
 * Starter API types. Generate these from the OpenAPI schema once the API
 * contract stabilizes; do not manually duplicate a growing schema.
 */
export type LanguageCode = "en" | "ja";

export interface LocalizedContent {
  content_language: LanguageCode;
}

export interface ProfileResponse extends LocalizedContent {
  display_name: string;
  headline: string;
  summary: string;
  profile_picture_url: string | null;
  links: Array<{ label: string; url: string; link_type: string }>;
}

export interface ExperienceUrl {
  label: string | null;
  url: string;
  link_type: "product" | "demo" | "repository" | "case_study" | "other";
}
