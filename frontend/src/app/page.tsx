import Portfolio from "./portfolio";
import { apiGet } from "@/lib/api";
import type {
  ExperienceResponse,
  LanguageCode,
  ProfileResponse,
  SkillResponse,
} from "@/types/api";
import { isLanguageCode } from "@/lib/i18n";

type SearchParams = Promise<{
  lang?: string;
  section?: string;
}>;

type ListResponse<T> = T[] | { results: T[] };

interface LoadedList<T> {
  items: T[];
  failed: boolean;
}

async function loadList<T>(path: string, lang: LanguageCode): Promise<LoadedList<T>> {
  try {
    const response = await apiGet<ListResponse<T>>(path, lang);
    return {
      items: Array.isArray(response) ? response : response.results,
      failed: false,
    };
  } catch {
    return { items: [], failed: true };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const locale = isLanguageCode(params.lang) ? params.lang : "en";
  const activeSection =
    params.section === "experiences" || params.section === "skills"
      ? params.section
      : "profile";

  const [profile, experiences, skills] = await Promise.all([
    loadList<ProfileResponse>("profile/", locale),
    loadList<ExperienceResponse>("experiences/", locale),
    loadList<SkillResponse>("skills/", locale),
  ]);

  return (
    <Portfolio
      locale={locale}
      activeSection={activeSection}
      profile={profile.items[0] ?? null}
      experiences={experiences.items}
      skills={skills.items}
      failed={{
        profile: profile.failed,
        experiences: experiences.failed,
        skills: skills.failed,
      }}
    />
  );
}
