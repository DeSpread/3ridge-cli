import { Command } from "commander";
import { mashboardRest } from "../clients/rest.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";

export function registerMindshareCommands(program: Command): void {
  const mindshare = program
    .command("mindshare")
    .description("Telegram mindshare data");

  mindshare
    .command("community")
    .description("Get community mindshare data")
    .action(async (_, cmd) => {
      try {
        const { format } = getGlobalOptions(cmd);
        const data = await mashboardRest("/telegram/mindshare/community");
        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });

  mindshare
    .command("keywords")
    .description("Get trending keyword mentions")
    .action(async (_, cmd) => {
      try {
        const { format } = getGlobalOptions(cmd);
        const data = await mashboardRest(
          "/telegram/tracking-keywords/mentions/top-series",
        );
        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });
}
