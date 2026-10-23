import type {
  AdminApiError,
  AdminExperienceFormData,
  AdminPrivateProfileResponse,
  AdminProfileFormData,
  AdminSkillFormData,
  AdminMutationOutcome,
  ExperienceResponse,
  SkillResponse,
} from "@/types/api";

const browserBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
const internalBaseUrl =
  process.env.API_INTERNAL_URL ?? browserBaseUrl;

function getBaseUrl(): string {
  return typeof window === "undefined" ? internalBaseUrl : browserBaseUrl;
}

function toErrorPayload(response: Response): Promise<AdminApiError> {
  return response.json().then((payload) => ({
    code: "api_error",
    message:
      payload?.detail ??
      payload?.message ??
      `Request failed with status ${response.status}`,
    field_errors: payload?.field_errors,
  })) as Promise<AdminApiError>;
}

async function requestJson<T>(
  path: string,
  init: RequestInit = {},
  fallback?: T,
): Promise<T> {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const url = new URL(`${baseUrl}/${path.replace(/^\//, "")}`);

  try {
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      ...init,
    });

    if (!response.ok) {
      const error = await toErrorPayload(response);
      throw new Error(error.message);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return (fallback as T) ?? (undefined as T);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (fallback !== undefined) {
      return fallback;
    }

    const apiError: AdminApiError = {
      code: "request_failed",
      message:
        error instanceof Error ? error.message : "Unknown API error",
    };

    throw new Error(apiError.message);
  }
}

export const demoPrivateProfile: AdminPrivateProfileResponse = {
  id: "private-profile-demo",
  profile: "profile-demo",
  address: "123 Example Street",
  phone_number: "+1 (555) 123-4567",
  citizenship: "United States",
  visa_type: "H-1B",
  visa_expiry_date: "2030-12-31",
};

export const demoExperienceList: ExperienceResponse[] = [
  {
    id: "exp-1",
    slug: "lead-platform-engineer",
    role: "Senior Software Engineer",
    title: "Lead Platform Engineer",
    overview: "Led platform reliability and developer experience improvements.",
    responsibilities: "Improved deployment pipelines and observability.",
    contributions: "Reduced incident recovery time and improved reliability.",
    start_date: "2023-06-01",
    end_date: null,
    employer: "Example Company",
    client: null,
    urls: [],
    skills: [{ skill_name: "TypeScript", order: 1 }],
    content_language: "en",
  },
  {
    id: "exp-2",
    slug: "full-stack-engineer",
    role: "Full-Stack Engineer",
    title: "Full-Stack Engineer",
    overview: "Built customer-facing features across the product stack.",
    responsibilities: "Developed APIs, UI features, and release automation.",
    contributions: "Improved conversion and reduced friction in onboarding.",
    start_date: "2021-01-01",
    end_date: "2023-05-31",
    employer: "Studio Example",
    client: "Product Team",
    urls: [],
    skills: [{ skill_name: "React", order: 1 }],
    content_language: "en",
  },
];

export const demoSkillList: SkillResponse[] = [
  {
    id: "skill-1",
    name: "TypeScript",
    slug: "typescript",
    category: "language",
    display_name: "TypeScript",
    description: "Typed JavaScript for reliable product development.",
    duration_months: 48,
    is_featured: true,
    order: 1,
    content_language: "en",
  },
  {
    id: "skill-2",
    name: "Next.js",
    slug: "nextjs",
    category: "framework",
    display_name: "Next.js",
    description: "Modern React web applications and product UX.",
    duration_months: 30,
    is_featured: true,
    order: 2,
    content_language: "en",
  },
];

export async function getAdminPrivateProfile(): Promise<AdminPrivateProfileResponse> {
  return requestJson<AdminPrivateProfileResponse>(
    "/admin/private-profile/",
    { method: "GET" },
    demoPrivateProfile,
  );
}

export async function saveAdminPrivateProfile(
  payload: Partial<AdminPrivateProfileResponse>,
): Promise<AdminPrivateProfileResponse> {
  return requestJson<AdminPrivateProfileResponse>(
    "/admin/private-profile/",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    { ...demoPrivateProfile, ...payload },
  );
}

export async function listAdminExperiences(): Promise<ExperienceResponse[]> {
  return requestJson<ExperienceResponse[]>(
    "/experiences/",
    { method: "GET" },
    demoExperienceList,
  );
}

export async function createAdminExperience(
  payload: AdminExperienceFormData,
): Promise<ExperienceResponse> {
  return requestJson<ExperienceResponse>(
    "/admin/experiences/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    {
      id: `exp-${Date.now()}`,
      slug: payload.slug || "new-experience",
      role: payload.role,
      title: payload.title || payload.role,
      overview: payload.overview,
      responsibilities: payload.responsibilities,
      contributions: payload.contributions,
      start_date: payload.start_date,
      end_date: payload.end_date,
      employer: payload.employer,
      client: payload.client,
      urls: payload.urls,
      skills: [],
      content_language: "en",
    },
  );
}

export async function updateAdminExperience(
  id: string,
  payload: Partial<AdminExperienceFormData>,
): Promise<ExperienceResponse> {
  return requestJson<ExperienceResponse>(
    `/admin/experiences/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    {
      id,
      slug: payload.slug ?? "updated-experience",
      role: payload.role ?? "Updated role",
      title: payload.title ?? payload.role ?? "Updated role",
      overview: payload.overview ?? "",
      responsibilities: payload.responsibilities ?? "",
      contributions: payload.contributions ?? null,
      start_date: payload.start_date ?? "2024-01-01",
      end_date: payload.end_date ?? null,
      employer: payload.employer ?? "Updated employer",
      client: payload.client ?? null,
      urls: payload.urls ?? [],
      skills: [],
      content_language: "en",
    },
  );
}

export async function deleteAdminExperience(id: string): Promise<boolean> {
  return requestJson<boolean>(
    `/admin/experiences/${id}/`,
    { method: "DELETE" },
    true,
  );
}

export async function listAdminSkills(): Promise<SkillResponse[]> {
  return requestJson<SkillResponse[]>(
    "/skills/",
    { method: "GET" },
    demoSkillList,
  );
}

export async function createAdminSkill(
  payload: AdminSkillFormData,
): Promise<SkillResponse> {
  return requestJson<SkillResponse>(
    "/admin/skills/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    {
      id: `skill-${Date.now()}`,
      name: payload.name,
      slug: payload.slug || payload.name.toLowerCase().replace(/\s+/g, "-"),
      category: payload.category,
      display_name: payload.display_name || payload.name,
      description: payload.description,
      duration_months: payload.duration_months,
      is_featured: payload.is_featured,
      order: payload.order,
      content_language: "en",
    },
  );
}

export async function updateAdminSkill(
  id: string,
  payload: Partial<AdminSkillFormData>,
): Promise<SkillResponse> {
  return requestJson<SkillResponse>(
    `/admin/skills/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    {
      id,
      name: payload.name ?? "Updated skill",
      slug: payload.slug ?? "updated-skill",
      category: payload.category ?? "tool",
      display_name: payload.display_name ?? payload.name ?? "Updated skill",
      description: payload.description ?? "",
      duration_months: payload.duration_months ?? 12,
      is_featured: payload.is_featured ?? false,
      order: payload.order ?? 1,
      content_language: "en",
    },
  );
}

export async function deleteAdminSkill(id: string): Promise<boolean> {
  return requestJson<boolean>(
    `/admin/skills/${id}/`,
    { method: "DELETE" },
    true,
  );
}

export function isAdminMutationResult<T>(
  value: AdminMutationOutcome<T>,
): value is { ok: true; data: T } {
  return value.ok === true;
}
