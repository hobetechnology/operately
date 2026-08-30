import type { MiniWorkMap } from ".";
import { buildGoalWorkItemsExportRows } from "./exportToExcel";

function item(overrides: Partial<MiniWorkMap.WorkItem>): MiniWorkMap.WorkItem {
  return {
    id: "item-1",
    type: "project",
    state: "active",
    status: "on_track",
    name: "Untitled",
    itemPath: "#",
    assignees: [],
    ...overrides,
  };
}

describe("buildGoalWorkItemsExportRows", () => {
  test("flattens a subgoal tree into indented rows with joined assignee names", () => {
    const child = item({
      id: "project-1",
      type: "project",
      name: "Ship onboarding flow",
      status: "on_track",
      assignees: [
        { id: "u1", fullName: "Alex R.", avatarUrl: null },
        { id: "u2", fullName: "Sophia T.", avatarUrl: null },
      ],
    });
    const parent = item({
      id: "goal-1",
      type: "goal",
      name: "Grow activation",
      status: "caution",
      children: [child],
    });

    const rows = buildGoalWorkItemsExportRows([parent]);

    expect(rows).toEqual([
      { Name: "Grow activation", Type: "Goal", Status: "Caution", Assignees: "" },
      { Name: "    Ship onboarding flow", Type: "Project", Status: "On track", Assignees: "Alex R., Sophia T." },
    ]);
  });

  test("returns no rows for an empty tree", () => {
    expect(buildGoalWorkItemsExportRows([])).toEqual([]);
  });
});
