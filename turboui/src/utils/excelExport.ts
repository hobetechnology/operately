import * as XLSX from "xlsx";

export function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "export"
  );
}

/**
 * Builds a single-sheet workbook from row objects and triggers a client-side
 * download. `columns` fixes the header order (json_to_sheet would otherwise
 * infer it from the first row's key order).
 */
export function downloadAsExcel(
  rows: Record<string, unknown>[],
  columns: string[],
  columnWidths: number[],
  sheetName: string,
  filename: string,
): void {
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: columns });
  worksheet["!cols"] = columnWidths.map((wch) => ({ wch }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, filename);
}
