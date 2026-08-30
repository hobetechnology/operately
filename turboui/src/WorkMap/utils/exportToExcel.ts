import { downloadAsExcel, todayStamp } from "../../utils/excelExport";
import { WorkMap } from "../components";

const STATUS_LABELS: Record<string, string> = {
  on_track: "On track",
  achieved: "Achieved",
  completed: "Completed",
  paused: "Paused",
  outdated: "Outdated",
  caution: "Caution",
  off_track: "Off track",
  missed: "Missed",
  pending: "Pending",
  dropped: "Dropped",
  partial: "Partial",
};

const TYPE_LABELS: Record<WorkMap.Item["type"], string> = {
  goal: "Goal",
  project: "Project",
  task: "Task",
};

const TAB_LABELS: Record<WorkMap.Filter, string> = {
  all: "All work",
  goals: "Goals",
  projects: "Projects",
  paused: "Paused",
  completed: "Completed",
};

const COLUMNS = ["Name", "Type", "Status", "Progress %", "Due Date", "Space", "Champion", "Next step"];
const COLUMN_WIDTHS = [44, 10, 14, 12, 14, 18, 20, 34];

function statusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function dueDate(item: WorkMap.Item, tab: WorkMap.Filter): string {
  if (tab === "completed" && item.completedOn) return formatDate(new Date(item.completedOn));
  return formatDate(item.timeframe?.endDate?.date);
}

function flattenItems(
  items: WorkMap.Item[],
  tab: WorkMap.Filter,
  depth: number,
  rows: Record<string, unknown>[],
): Record<string, unknown>[] {
  for (const item of items) {
    rows.push({
      Name: "    ".repeat(depth) + item.name,
      Type: TYPE_LABELS[item.type] || item.type,
      Status: statusLabel(item.status),
      "Progress %": item.progress ?? "",
      "Due Date": dueDate(item, tab),
      Space: item.space?.name || "",
      Champion: item.owner?.fullName || "",
      "Next step": item.nextStep || "",
    });

    if (item.children && item.children.length > 0) {
      flattenItems(item.children, tab, depth + 1, rows);
    }
  }

  return rows;
}

/**
 * Flattens the (already filtered/sorted) WorkMap item tree into the row shape
 * written to the exported spreadsheet. Exported separately so the transform
 * can be unit tested without triggering an actual file download.
 */
export function buildWorkMapExportRows(items: WorkMap.Item[], tab: WorkMap.Filter): Record<string, unknown>[] {
  return flattenItems(items, tab, 0, []);
}

/**
 * Exports the exact tree currently shown for a WorkMap tab (already filtered/sorted
 * by useWorkMapTab) so the file always matches what's on screen.
 */
export function exportWorkMapToExcel(items: WorkMap.Item[], tab: WorkMap.Filter): void {
  const rows = buildWorkMapExportRows(items, tab);
  const filename = `work-map-${tab}-${todayStamp()}.xlsx`;

  downloadAsExcel(rows, COLUMNS, COLUMN_WIDTHS, TAB_LABELS[tab] || "Work Map", filename);
}
