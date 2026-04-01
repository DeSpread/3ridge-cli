import { Command } from "commander";
import { createGraphQLClient } from "../clients/graphql.js";
import { QUESTS_QUERY } from "../queries/index.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";
import type { Quest } from "../clients/types.js";

export function registerQuestCommands(program: Command): void {
  const quests = program
    .command("quests")
    .description("Quest operations");

  quests
    .command("list <eventId>")
    .description("List quests for a campaign")
    .action(async (eventId, _, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = createGraphQLClient({ apiUrl });
        const data = await client.request<{ quests: Quest[] }>(
          QUESTS_QUERY,
          { eventId },
        );

        const list = data.quests.map((q) => ({
          id: q._id,
          type: q.type,
          displayText: q.displayText,
          createdAt: q.createdAt,
        }));

        output(list, format, [
          { key: "id", label: "ID" },
          { key: "type", label: "Type" },
          { key: "displayText", label: "Display Text" },
          { key: "createdAt", label: "Created" },
        ]);
      } catch (err) {
        handleError(err);
      }
    });
}
