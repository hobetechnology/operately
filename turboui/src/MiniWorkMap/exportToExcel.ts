import { downloadAsExcel, slugify, todayStamp } from "../utils/excelExport";
import { MiniWorkMap } from ".";

const STATUS_LABELS: Record<string, string> = {
  on_track: "On track",
  completed: "Completed",
  achieved: "Achieved",
  missed: "Missed",
  paused: "Paused",
  caution: "Caution",
  off_track: "Off track",
  pending: "Pending",
  outdated: "Outdated",
};

const TYPE_LABELS: Record<MiniWorkMap.WorkItem["type"], string> = {
  goal: "Goal",
  project: "Project",
};

const COLUMNS = ["Name", "Type", "Status", "Assignees"];
const COLUMN_WIDTHS = [44, 10, 14, 28];

function flattenItems(
  items: MiniWorkMap.WorkItem[],
  depth: number,
  rows: Record<string, unknown>[],
): Record<string, unknown>[] {
  for (const item of items) {
    rows.push({
      Name: "    ".repeat(depth) + item.name,
      Type: TYPE_LABELS[item.type] || item.type,
      Status: STATUS_LABELS[item.status] || item.status,
      Assignees: item.assignees.map((person) => person.fullName).join(", "),
    });

    if (item.children && item.children.length > 0) {
      flattenItems(item.children, depth + 1, rows);
    }
  }

  return rows;
}

/**
 * Flattens the goal's related-work tree into the row shape written to the
 * exported spreadsheet. Exported separately so the transform can be unit
 * tested without triggering an actual file download.
 */
export function buildGoalWorkItemsExportRows(items: MiniWorkMap.WorkItem[]): Record<string, unknown>[] {
  return flattenItems(items, 0, []);
}

/**
 * Exports a goal's "Subgoals & Projects" tree, in the same order/depth shown
 * in that section. Only Name/Type/Status/Assignees are available on this
 * dataset (progress, due date, space, and next step aren't fetched for
 * related work items), so those are the columns produced.
 */
export function exportGoalWorkItemsToExcel(items: MiniWorkMap.WorkItem[], goalName: string): void {
  const rows = buildGoalWorkItemsExportRows(items);
  const filename = `${slugify(goalName)}-${todayStamp()}.xlsx`;

  downloadAsExcel(rows, COLUMNS, COLUMN_WIDTHS, "Subgoals & Projects", filename);
}
