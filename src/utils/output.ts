import type { Command } from "commander";
import { formatJson } from "../formatters/json.js";
import { formatCsv } from "../formatters/csv.js";
import { formatTable } from "../formatters/table.js";

export type OutputFormat = "json" | "csv" | "table";

function getRootCommand(cmd: Command): Command {
  let current = cmd;
  while (current.parent) {
    current = current.parent;
  }
  return current;
}

export function getFormat(cmd: Command): OutputFormat {
  const root = getRootCommand(cmd);
  const opts = root.opts();
  return (opts.format as OutputFormat) ?? "json";
}

export function getGlobalOptions(cmd: Command): {
  format: OutputFormat;
  apiUrl?: string;
  verbose?: boolean;
} {
  const root = getRootCommand(cmd);
  const opts = root.opts();
  return {
    format: (opts.format as OutputFormat) ?? "json",
    apiUrl: opts.apiUrl as string | undefined,
    verbose: opts.verbose as boolean | undefined,
  };
}

export function output(
  data: unknown,
  format: OutputFormat,
  tableColumns?: { key: string; label: string }[],
): void {
  switch (format) {
    case "csv":
      console.log(formatCsv(data));
      break;
    case "table":
      console.log(formatTable(data, tableColumns));
      break;
    case "json":
    default:
      console.log(formatJson(data));
      break;
  }
}
