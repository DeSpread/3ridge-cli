import { Command } from "commander";
import { createGraphQLClient } from "../clients/graphql.js";
import { EVENT_QUERY } from "../queries/index.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";
import type { Event } from "../clients/types.js";

export function registerRewardCommands(program: Command): void {
  const rewards = program
    .command("rewards")
    .description("Campaign reward operations");

  rewards
    .command("summary <eventId>")
    .description("Get reward summary for a campaign")
    .action(async (eventId, _, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const client = createGraphQLClient({ apiUrl });
        const data = await client.request<{ event: Event }>(
          EVENT_QUERY,
          { _id: eventId },
        );

        const e = data.event;
        if (!e.reward) {
          console.log("No reward configured for this campaign");
          return;
        }

        const summary = {
          campaignId: e._id,
          campaignTitle: e.title,
          rewardType: e.reward.type,
          description: e.reward.description,
          point: e.reward.point,
          prizes: e.reward.prizes.map((p) => ({
            name: p.name,
            method: p.method,
            winnerLimit: p.winnerLimit,
          })),
          totalPrizes: e.reward.prizes.length,
          participantCount: e.participants.length,
        };

        output(summary, format);
      } catch (err) {
        handleError(err);
      }
    });
}
