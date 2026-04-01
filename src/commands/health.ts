import { Command } from "commander";
import { trigeRest } from "../clients/rest.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";

export function registerHealthCommands(program: Command): void {
  program
    .command("health")
    .description("Check 3ridge API health status")
    .action(async (_, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        const data = await trigeRest("/health", { apiUrl });
        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });
}
