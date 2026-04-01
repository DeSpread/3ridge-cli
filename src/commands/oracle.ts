import { Command } from "commander";
import { mashboardRest } from "../clients/rest.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";

export function registerOracleCommands(program: Command): void {
  const oracle = program
    .command("oracle")
    .description("Market data oracle");

  oracle
    .command("summary")
    .description("Get market data summary (kimchi premium, stocks, real estate)")
    .action(async (_, cmd) => {
      try {
        const { format } = getGlobalOptions(cmd);
        const data = await mashboardRest("/oracle/summary");
        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });
}
