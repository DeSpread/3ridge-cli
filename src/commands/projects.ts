import { Command } from "commander";
import { createGraphQLClient } from "../clients/graphql.js";
import { PROJECTS_QUERY, PROJECT_QUERY } from "../queries/index.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";
import type { Project } from "../clients/types.js";

export function registerProjectCommands(program: Command): void {
  const projects = program
    .command("projects")
    .description("Project operations");

  projects
    .command("list")
    .description("List all projects")
    .action(async (_, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = createGraphQLClient({ apiUrl });
        const data = await client.request<{ projects: Project[] }>(PROJECTS_QUERY);

        const list = data.projects.map((p) => ({
          id: p._id,
          name: p.name,
          description: p.description.slice(0, 80),
          website: p.socials.website ?? "-",
          twitter: p.socials.twitter ?? "-",
        }));

        output(list, format, [
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "website", label: "Website" },
          { key: "twitter", label: "Twitter" },
        ]);
      } catch (err) {
        handleError(err);
      }
    });

  projects
    .command("get <id>")
    .description("Get project details")
    .action(async (id, _, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = createGraphQLClient({ apiUrl });
        const data = await client.request<{ project: Project }>(
          PROJECT_QUERY,
          { _id: id },
        );
        output(data.project, format);
      } catch (err) {
        handleError(err);
      }
    });
}
