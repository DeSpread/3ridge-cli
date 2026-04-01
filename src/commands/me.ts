import { Command } from "commander";
import { requireAuth } from "../auth/guard.js";
import {
  ME_QUERY,
  COMPLETED_QUESTS_QUERY,
  PARTICIPATED_EVENTS_QUERY,
} from "../queries/index.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";
import type {
  User,
  CompletedQuest,
  ParticipatedEventsResponse,
} from "../clients/types.js";

export function registerMeCommands(program: Command): void {
  program
    .command("me")
    .description("Show current user profile (requires login)")
    .action(async (_, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = await requireAuth(apiUrl);
        const data = await client.request<{ me: User }>(ME_QUERY);
        output(data.me, format);
      } catch (err) {
        handleError(err);
      }
    });

  const my = program
    .command("my")
    .description("Personal data operations (requires login)");

  my.command("completions")
    .description("List my completed quests")
    .option("--event <eventId>", "filter by event ID")
    .action(async (opts, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = await requireAuth(apiUrl);
        const data = await client.request<{
          completedQuests: CompletedQuest[];
        }>(COMPLETED_QUESTS_QUERY, {
          eventId: opts.event ?? null,
        });

        output(data.completedQuests, format, [
          { key: "event", label: "Event" },
          { key: "completedQuestIds", label: "Completed Quest IDs" },
          { key: "isCompletedEvent", label: "Event Completed" },
        ]);
      } catch (err) {
        handleError(err);
      }
    });

  my.command("events")
    .description("List my participated events")
    .action(async (_, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = await requireAuth(apiUrl);
        const data = await client.request<{
          participatedEvents: ParticipatedEventsResponse;
        }>(PARTICIPATED_EVENTS_QUERY);

        const result = data.participatedEvents;
        output(
          {
            participatedCount: result.participatedEventsCounts,
            completedCount: result.completedEventsCounts,
            participated: result.participatedEvents.map((e) => ({
              id: e._id,
              title: e.title,
              project: e.project?.name ?? "-",
              quests: e.questCounts,
              begin: e.beginDate,
              until: e.untilDate,
            })),
            completed: result.completedEvents.map((e) => ({
              id: e._id,
              title: e.title,
            })),
          },
          format,
        );
      } catch (err) {
        handleError(err);
      }
    });
}
