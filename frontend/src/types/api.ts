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

export interface AdminPrivateProfileResponse {
  id: string;
  profile: string;
  address: string;
  phone_number: string;
  citizenship: string;
  visa_type: string;
  visa_expiry_date: string | null;
}

export interface AdminProfileLinkInput {
  link_type: "website" | "github" | "linkedin" | "portfolio" | "other";
  label: string;
  url: string;
  order: number;
}

export interface AdminProfileSpokenLanguageInput {
  language_name: string;
  proficiency_level: "native" | "business" | "professional" | "conversational";
  order: number;
}

export interface AdminProfileFormData {
  profile_picture_url: string | null;
  is_active: boolean;
  display_name: string;
  headline: string;
  summary: string;
  address?: string;
  phone_number?: string;
  citizenship?: string;
  visa_type?: string;
  visa_expiry_date?: string | null;
  links: AdminProfileLinkInput[];
  spoken_languages: AdminProfileSpokenLanguageInput[];
}

export interface AdminExperienceFormData {
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
  is_published: boolean;
  order: number;
  urls: ExperienceUrl[];
}

export interface AdminSkillFormData {
  name: string;
  slug: string;
  category: string;
  display_name: string;
  description: string;
  duration_months: number | null;
  is_featured: boolean;
  order: number;
}

export interface AdminApiError {
  code: string;
  message: string;
  field_errors?: Record<string, string[]>;
}

export interface AdminMutationResult<T> {
  ok: true;
  data: T;
}

export interface AdminMutationErrorResult {
  ok: false;
  error: AdminApiError;
}

export type AdminMutationOutcome<T> = AdminMutationResult<T> | AdminMutationErrorResult;
