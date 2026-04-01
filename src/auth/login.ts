import { GraphQLClient } from "graphql-request";
import { saveCredentials } from "./credentials.js";
import type { LoginResponse, TokenResponse } from "../clients/types.js";

const LOGIN_MUTATION = `
  mutation loginByEmail($email: String!, $password: String!) {
    loginByEmail(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        sub
        roles
        adminRoles
        group
        username
      }
    }
  }
`;

const TOKEN_REFRESH_MUTATION = `
  mutation token {
    token {
      accessToken
      user {
        sub
        roles
        adminRoles
        group
        username
      }
    }
  }
`;

export async function login(
  email: string,
  password: string,
  apiUrl: string,
): Promise<LoginResponse> {
  const client = new GraphQLClient(apiUrl);
  const data = await client.request<{ loginByEmail: LoginResponse }>(
    LOGIN_MUTATION,
    { email, password },
  );
  const result = data.loginByEmail;

  // Token expires in 1 hour (from backend JWT config)
  const expiresAt = new Date(Date.now() + 55 * 60 * 1000).toISOString();

  saveCredentials({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresAt,
    apiUrl,
  });

  return result;
}

export async function refreshToken(
  currentRefreshToken: string,
  apiUrl: string,
): Promise<TokenResponse> {
  const client = new GraphQLClient(apiUrl, {
    headers: { Authorization: `Bearer ${currentRefreshToken}` },
  });
  const data = await client.request<{ token: TokenResponse }>(TOKEN_REFRESH_MUTATION);
  return data.token;
}
