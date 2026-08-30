import { createMockItem } from "../tests/mockData";
import { buildWorkMapExportRows } from "./exportToExcel";

describe("buildWorkMapExportRows", () => {
  test("flattens a goal and its child into indented rows with the WorkMap columns", () => {
    const goal = createMockItem("goal-1", "Grow revenue", "goal", "on_track", 40, true);

    const rows = buildWorkMapExportRows([goal], "all");

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      Name: "Grow revenue",
      Type: "Goal",
      Status: "On track",
      "Progress %": 40,
      Space: "Product",
      Champion: "Alex R.",
      "Next step": "Next action to take",
    });
    expect(rows[1]).toMatchObject({
      Name: "    Child item 1",
      Type: "Project",
      Status: "On track",
    });
  });

  test("uses completedOn (not the timeframe end date) as the Due Date on the completed tab", () => {
    const goal = createMockItem("goal-2", "Ship v2", "goal", "achieved", 100);

    const rows = buildWorkMapExportRows([goal], "completed");

    expect(rows[0]).toMatchObject({
      Status: "Achieved",
      "Due Date": "2025-03-15",
    });
  });

  test("falls back to empty strings when space, champion, or next step are missing", () => {
    const goal = createMockItem("goal-3", "No metadata", "goal", "pending", 0);
    goal.space = null;
    goal.owner = null;
    goal.nextStep = "";

    const rows = buildWorkMapExportRows([goal], "all");

    expect(rows[0]).toMatchObject({ Space: "", Champion: "", "Next step": "" });
  });
});
