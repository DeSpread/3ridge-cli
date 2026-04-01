import { ClientError } from "graphql-request";

export function handleError(err: unknown): never {
  if (err instanceof ClientError) {
    const message =
      err.response.errors?.[0]?.message ?? "GraphQL request failed";
    console.error(`Error: ${message}`);
    if (err.response.status === 401) {
      console.error("Hint: Run `3ridge login` to authenticate");
    }
  } else if (err instanceof Error) {
    console.error(`Error: ${err.message}`);
  } else {
    console.error("An unexpected error occurred");
  }
  process.exit(1);
}
