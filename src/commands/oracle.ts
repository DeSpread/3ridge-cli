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
    .option("--range <range>", "date range: 7d, 30d, 90d, 1y, all", "30d")
    .action(async (opts, cmd) => {
      try {
        const { format } = getGlobalOptions(cmd);
        const params = new URLSearchParams({ range: opts.range });
        const data = await mashboardRest(`/oracle/summary?${params}`);
        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });
}
