/**
 * Starter API types. Generate these from the OpenAPI schema once the API
 * contract stabilizes; do not manually duplicate a growing schema.
 */
export type LanguageCode = "en" | "ja" | "zh-Hant-TW" | "ko";

export interface LocalizedContent {
  content_language: LanguageCode;
}

export interface ProfileResponse extends LocalizedContent {
  id: string;
  display_name: string;
  headline: string;
  summary: string;
  profile_picture_url: string | null;
  links: Array<{ label: string; url: string; link_type: string; order: number }>;
  spoken_languages: Array<{
    language_name: string;
    proficiency_level: "native" | "business" | "professional" | "conversational";
    order: number;
  }>;
}

export interface ExperienceResponse extends LocalizedContent {
  id: string;
  slug: string;
  role: string;
  title: string;
  overview: string;
  responsibilities: string;
  contributions: string | null;
  start_date: string;
  end_date: string | null;
  employer: string;
  client: string | null;
  urls: ExperienceUrl[];
  skills: Array<{ skill_name: string; order: number }>;
}

export interface SkillResponse extends LocalizedContent {
  id: string;
  name: string;
  slug: string;
  category: string;
  display_name: string;
  description: string;
  duration_months: number | null;
  is_featured: boolean;
  order: number;
}

export interface ExperienceUrl {
  label: string | null;
  url: string;
  url_type: "product" | "demo" | "repository" | "case_study" | "other";
  order: number;
}
