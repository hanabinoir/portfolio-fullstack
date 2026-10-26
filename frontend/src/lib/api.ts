import type { LanguageCode } from "@/types/api";

const browserBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
const internalBaseUrl =
  process.env.API_INTERNAL_URL ?? browserBaseUrl;

/**
 * Use this helper for server-side calls from Next.js server components.
 * Never pass secrets to NEXT_PUBLIC_* variables.
 */
export async function apiGet<T>(
  path: string,
  lang: LanguageCode = "en",
): Promise<T> {
  const baseUrl = typeof window === "undefined" ? internalBaseUrl : browserBaseUrl;
  const url = new URL(`${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
  url.searchParams.set("lang", lang);

  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}
