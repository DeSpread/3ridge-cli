import { GraphQLClient } from "graphql-request";

const DEFAULT_API_URL = "https://api.3ridge.io/graphql";

export function createGraphQLClient(options?: {
  apiUrl?: string;
}): GraphQLClient {
  const url = options?.apiUrl ?? DEFAULT_API_URL;
  return new GraphQLClient(url);
}
