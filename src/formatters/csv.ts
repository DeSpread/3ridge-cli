export function formatCsv(data: unknown): string {
  if (!Array.isArray(data)) {
    data = [data];
  }

  const items = data as Record<string, unknown>[];
  if (items.length === 0) return "";

  // Collect all unique keys across all items
  const keys = [...new Set(items.flatMap((item) => Object.keys(item)))];

  const escapeField = (val: unknown): string => {
    const str = val === null || val === undefined ? "" : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = keys.join(",");
  const rows = items.map((item) =>
    keys.map((key) => escapeField(item[key])).join(","),
  );

  return [header, ...rows].join("\n");
}
