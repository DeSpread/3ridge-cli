import { GraphQLClient } from "graphql-request";
import { loadCredentials } from "../auth/credentials.js";

const DEFAULT_API_URL = "https://api.3ridge.io/graphql";

export function getApiUrl(overrideUrl?: string): string {
  if (overrideUrl) return overrideUrl;
  const creds = loadCredentials();
  return creds?.apiUrl ?? DEFAULT_API_URL;
}

export function createGraphQLClient(options?: {
  apiUrl?: string;
  accessToken?: string;
}): GraphQLClient {
  const url = getApiUrl(options?.apiUrl);
  const headers: Record<string, string> = {};

  const token = options?.accessToken ?? loadCredentials()?.accessToken;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return new GraphQLClient(url, { headers });
}
