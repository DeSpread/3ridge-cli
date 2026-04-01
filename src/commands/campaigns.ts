import { Command } from "commander";
import { createGraphQLClient } from "../clients/graphql.js";
import { EVENTS_QUERY, EVENT_QUERY } from "../queries/index.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";
import type { Event } from "../clients/types.js";

export function registerCampaignCommands(program: Command): void {
  const campaigns = program
    .command("campaigns")
    .description("Campaign (event) operations");

  campaigns
    .command("list")
    .description("List all campaigns")
    .option("--visible", "only visible campaigns")
    .action(async (opts, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = createGraphQLClient({ apiUrl });
        const data = await client.request<{ events: Event[] }>(
          EVENTS_QUERY,
          { isVisible: opts.visible ? true : undefined },
        );

        const campaigns = data.events.map((e) => ({
          id: e._id,
          title: e.title,
          project: e.project?.name ?? "-",
          quests: e.questCounts,
          participants: e.participants.length,
          visible: e.isVisible,
          begin: e.beginDate,
          until: e.untilDate,
        }));

        output(campaigns, format, [
          { key: "id", label: "ID" },
          { key: "title", label: "Title" },
          { key: "project", label: "Project" },
          { key: "quests", label: "Quests" },
          { key: "participants", label: "Participants" },
          { key: "visible", label: "Visible" },
          { key: "begin", label: "Begin" },
          { key: "until", label: "Until" },
        ]);
      } catch (err) {
        handleError(err);
      }
    });

  campaigns
    .command("get <id>")
    .description("Get campaign details")
    .action(async (id, _, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = createGraphQLClient({ apiUrl });
        const data = await client.request<{ event: Event }>(
          EVENT_QUERY,
          { _id: id },
        );
        output(data.event, format);
      } catch (err) {
        handleError(err);
      }
    });

  campaigns
    .command("stats <id>")
    .description("Get campaign statistics summary")
    .action(async (id, _, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = createGraphQLClient({ apiUrl });
        const data = await client.request<{ event: Event }>(
          EVENT_QUERY,
          { _id: id },
        );

        const e = data.event;
        const stats = {
          id: e._id,
          title: e.title,
          project: e.project?.name ?? "-",
          participantCount: e.participants.length,
          questCount: e.questCounts,
          rewardType: e.reward?.type ?? "NONE",
          rewardPoint: e.reward?.point ?? 0,
          prizeCount: e.reward?.prizes.length ?? 0,
          isVisible: e.isVisible,
          beginDate: e.beginDate,
          untilDate: e.untilDate,
          durationDays: Math.ceil(
            (new Date(e.untilDate).getTime() - new Date(e.beginDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        };

        output(stats, format, [
          { key: "id", label: "ID" },
          { key: "title", label: "Title" },
          { key: "project", label: "Project" },
          { key: "participantCount", label: "Participants" },
          { key: "questCount", label: "Quests" },
          { key: "rewardType", label: "Reward Type" },
          { key: "rewardPoint", label: "Reward Points" },
          { key: "prizeCount", label: "Prizes" },
          { key: "durationDays", label: "Duration (days)" },
        ]);
      } catch (err) {
        handleError(err);
      }
    });
}
