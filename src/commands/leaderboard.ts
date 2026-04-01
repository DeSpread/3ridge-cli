import { Command } from "commander";
import { mashboardRest } from "../clients/rest.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";

export function registerLeaderboardCommands(program: Command): void {
  const leaderboard = program
    .command("leaderboard")
    .description("Storyteller leaderboard operations");

  leaderboard
    .command("list")
    .description("List all leaderboards")
    .action(async (_, cmd) => {
      try {
        const { format } = getGlobalOptions(cmd);
        const data = await mashboardRest("/storyteller-leaderboard");
        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });

  leaderboard
    .command("get <id>")
    .description("Get leaderboard details")
    .action(async (id, _, cmd) => {
      try {
        const { format } = getGlobalOptions(cmd);
        const data = await mashboardRest(`/storyteller-leaderboard/${encodeURIComponent(id)}`);
        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });

  leaderboard
    .command("top <id>")
    .description("Get top participants from a leaderboard")
    .option("--limit <n>", "number of top entries", "100")
    .action(async (id, opts, cmd) => {
      try {
        const { format } = getGlobalOptions(cmd);
        const data = await mashboardRest<{ scores?: unknown[]; [key: string]: unknown }>(
          `/storyteller-leaderboard/${encodeURIComponent(id)}/timeseries-group`,
        );

        // Apply limit if scores array exists
        if (Array.isArray(data.scores)) {
          data.scores = data.scores.slice(0, parseInt(opts.limit, 10));
        }

        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });
}
