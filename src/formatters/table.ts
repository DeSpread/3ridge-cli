import Table from "cli-table3";

export function formatTable(
  data: unknown,
  columns?: { key: string; label: string }[],
): string {
  if (!Array.isArray(data)) {
    data = [data];
  }

  const items = data as Record<string, unknown>[];
  if (items.length === 0) return "(no data)";

  const cols =
    columns ??
    Object.keys(items[0]).map((key) => ({ key, label: key }));

  const table = new Table({
    head: cols.map((c) => c.label),
    style: { head: ["cyan"] },
  });

  for (const item of items) {
    table.push(
      cols.map((c) => {
        const val = item[c.key];
        if (val === null || val === undefined) return "";
        if (typeof val === "object") return JSON.stringify(val);
        return String(val);
      }),
    );
  }

  return table.toString();
}
