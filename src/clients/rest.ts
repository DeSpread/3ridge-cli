const DEFAULT_API_BASE = "https://api.3ridge.io";
const MASHBOARD_API_URL = "https://mashboard-api.despreadlabs.io";

// 3ridge REST client (GET only, public endpoints)
export async function trigeRest<T = unknown>(
  path: string,
  options?: { apiUrl?: string },
): Promise<T> {
  const baseUrl = options?.apiUrl?.replace(/\/graphql$/, "") ?? DEFAULT_API_BASE;
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`3ridge API error: ${res.status} ${res.statusText} — ${url}`);
  }

  return (await res.json()) as T;
}

// Mashboard REST client (GET only, public endpoints)
export async function mashboardRest<T = unknown>(path: string): Promise<T> {
  const url = `${MASHBOARD_API_URL}${path}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Mashboard API error: ${res.status} ${res.statusText} — ${url}`);
  }
  return (await res.json()) as T;
}
