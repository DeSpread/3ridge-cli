import { Command } from "commander";
import { requireAdmin } from "../auth/guard.js";
import { ADMIN_USERS_QUERY } from "../queries/index.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";
import type { AdminUser } from "../clients/types.js";

export function registerAdminCommands(program: Command): void {
  const admin = program
    .command("admin")
    .description("Admin operations (requires admin role)");

  admin
    .command("users")
    .description("List admin users")
    .action(async (_, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = await requireAdmin(apiUrl);
        const data = await client.request<{ adminUsers: AdminUser[] }>(
          ADMIN_USERS_QUERY,
        );

        const list = data.adminUsers.map((u) => ({
          id: u._id,
          name: u.name,
          username: u.username,
          roles: u.roles.join(", "),
          slackId: u.slackId ?? "-",
        }));

        output(list, format, [
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "username", label: "Username" },
          { key: "roles", label: "Roles" },
          { key: "slackId", label: "Slack ID" },
        ]);
      } catch (err) {
        handleError(err);
      }
    });
}
