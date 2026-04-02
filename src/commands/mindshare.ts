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
    .option("--days <n>", "interval: 1, 7, 14, 30, 90", "30")
    .option("--end-date <date>", "end date (YYYY-MM-DD) for custom range")
    .option("--pretge", "show pre-TGE projects only")
    .option("--limit <n>", "number of projects to return", "50")
    .option("--offset <n>", "pagination offset", "0")
    .action(async (opts, cmd) => {
      try {
        const { format } = getGlobalOptions(cmd);
        const days = parseInt(opts.days, 10);
        const params = new URLSearchParams();
        params.set("intervalDays", String(days));
        params.set("limit", opts.limit);
        params.set("offset", opts.offset);
        if (opts.pretge) params.set("pretge", "true");

        let path: string;
        if (opts.endDate) {
          // Custom range endpoint (no 1-day support)
          params.set("endDate", opts.endDate);
          path = `/telegram/mindshare/community/custom-range?${params}`;
        } else {
          path = `/telegram/mindshare/community?${params}`;
        }

        const data = await mashboardRest(path);
        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });

  mindshare
    .command("keywords")
    .description("Get trending keyword mentions")
    .option("--days <n>", "lookback period in days", "30")
    .option("--type <type>", "keyword type: narrative, project", "narrative")
    .option("--limit <n>", "number of keywords to return", "20")
    .action(async (opts, cmd) => {
      try {
        const { format } = getGlobalOptions(cmd);
        const params = new URLSearchParams({
          nDays: opts.days,
          type: opts.type,
          limit: opts.limit,
        });
        const data = await mashboardRest(
          `/telegram/tracking-keywords/mentions/top-series?${params}`,
        );
        output(data, format);
      } catch (err) {
        handleError(err);
      }
    });
}
