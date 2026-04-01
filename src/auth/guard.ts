import { loadCredentials, saveCredentials } from "./credentials.js";
import { refreshToken } from "./login.js";
import { createGraphQLClient } from "../clients/graphql.js";
import type { GraphQLClient } from "graphql-request";

export async function requireAuth(apiUrl?: string): Promise<GraphQLClient> {
  const creds = loadCredentials();
  if (!creds) {
    console.error("Not logged in. Run: 3ridge login");
    process.exit(1);
  }

  // Check if token is expired and refresh
  if (new Date(creds.expiresAt) < new Date()) {
    try {
      const refreshed = await refreshToken(creds.refreshToken, creds.apiUrl);
      const expiresAt = new Date(Date.now() + 55 * 60 * 1000).toISOString();
      saveCredentials({
        ...creds,
        accessToken: refreshed.accessToken,
        expiresAt,
      });
      return createGraphQLClient({
        apiUrl: apiUrl ?? creds.apiUrl,
        accessToken: refreshed.accessToken,
      });
    } catch {
      console.error("Session expired. Run: 3ridge login");
      process.exit(1);
    }
  }

  return createGraphQLClient({
    apiUrl: apiUrl ?? creds.apiUrl,
    accessToken: creds.accessToken,
  });
}

export async function requireAdmin(apiUrl?: string): Promise<GraphQLClient> {
  const client = await requireAuth(apiUrl);
  const creds = loadCredentials()!;

  // Decode JWT to check admin role (payload is base64url)
  const payload = creds.accessToken.split(".")[1];
  if (!payload) {
    console.error("Invalid token format");
    process.exit(1);
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    );
    if (decoded.group !== "Admin") {
      console.error("Admin access required");
      process.exit(1);
    }
  } catch {
    console.error("Failed to decode token");
    process.exit(1);
  }

  return client;
}
