import { loadCredentials } from "../auth/credentials.js";

const MASHBOARD_API_URL = "https://mashboard-api.despreadlabs.io";

function getBaseApiUrl(apiUrl?: string): string {
  if (apiUrl) {
    // Strip /graphql suffix to get base URL for REST endpoints
    return apiUrl.replace(/\/graphql$/, "");
  }
  const creds = loadCredentials();
  const gqlUrl = creds?.apiUrl ?? "https://api.3ridge.io/graphql";
  return gqlUrl.replace(/\/graphql$/, "");
}

// 3ridge REST client (GET only)
export async function trigeRest<T = unknown>(
  path: string,
  options?: { apiUrl?: string; accessToken?: string },
): Promise<T> {
  const baseUrl = getBaseApiUrl(options?.apiUrl);
  const url = `${baseUrl}${path}`;

  const headers: Record<string, string> = {};
  const token = options?.accessToken ?? loadCredentials()?.accessToken;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) {
    throw new Error(`3ridge API error: ${res.status} ${res.statusText} — ${url}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("text/csv")) {
    return (await res.text()) as T;
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
