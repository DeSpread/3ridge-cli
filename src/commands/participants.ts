import { Command } from "commander";
import { trigeRest } from "../clients/rest.js";
import { requireAdmin } from "../auth/guard.js";
import { loadCredentials } from "../auth/credentials.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";

export function registerParticipantCommands(program: Command): void {
  const participants = program
    .command("participants")
    .description("Participant data operations");

  participants
    .command("export <eventId>")
    .description("Export campaign participants (admin only)")
    .action(async (eventId, _, cmd) => {
      try {
        const { format, apiUrl } = getGlobalOptions(cmd);
        await requireAdmin(apiUrl);
        const creds = loadCredentials()!;

        const csvText = await trigeRest<string>(
          `/event/${eventId}/participants.csv`,
          { apiUrl, accessToken: creds.accessToken },
        );

        if (format === "csv" || format === "json") {
          // For CSV format or JSON, parse the CSV first
          if (format === "csv") {
            console.log(csvText);
          } else {
            // Parse CSV to JSON
            const lines = csvText.trim().split("\n");
            const headers = lines[0].split(",");
            const rows = lines.slice(1).map((line) => {
              const values = line.split(",");
              const row: Record<string, string> = {};
              headers.forEach((h, i) => {
                row[h] = values[i] ?? "";
              });
              return row;
            });
            output(rows, "json");
          }
        } else {
          // table format - parse CSV and display as table
          const lines = csvText.trim().split("\n");
          const headers = lines[0].split(",");
          const rows = lines.slice(1).map((line) => {
            const values = line.split(",");
            const row: Record<string, string> = {};
            headers.forEach((h, i) => {
              row[h] = values[i] ?? "";
            });
            return row;
          });
          output(
            rows,
            "table",
            headers.map((h) => ({ key: h, label: h })),
          );
        }
      } catch (err) {
        handleError(err);
      }
    });
}
