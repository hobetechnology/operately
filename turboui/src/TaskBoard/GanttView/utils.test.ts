import { createContextualDate } from "../../DateField/mockData";
import type { TaskBoard } from "../components";
import { sortedTaskTimelineItems, toTaskTimelineItem } from "./utils";

function task(overrides: Partial<TaskBoard.Task>): TaskBoard.Task {
  return {
    id: "task-1",
    title: "Untitled",
    status: null,
    description: null,
    link: "#",
    milestone: null,
    dueDate: null,
    startDate: null,
    type: "project",
    ...overrides,
  };
}

describe("toTaskTimelineItem", () => {
  test("maps title/link/dates/status color onto the timeline item shape", () => {
    const item = toTaskTimelineItem(
      task({
        id: "task-9",
        title: "Ship onboarding flow",
        link: "/tasks/task-9",
        startDate: createContextualDate("2026-01-05", "day"),
        dueDate: createContextualDate("2026-01-20", "day"),
        status: { id: "s1", value: "in_progress", label: "In progress", color: "blue", icon: "circleDot", index: 0 },
      }),
    );

    expect(item).toMatchObject({
      id: "task-9",
      name: "Ship onboarding flow",
      link: "/tasks/task-9",
      statusColor: "blue",
    });
    expect(item.startDate?.toISOString().slice(0, 10)).toBe("2026-01-05");
    expect(item.endDate?.toISOString().slice(0, 10)).toBe("2026-01-20");
  });

  test("has no start/end date and no status color when the task has neither set", () => {
    const item = toTaskTimelineItem(task({}));

    expect(item.startDate).toBeNull();
    expect(item.endDate).toBeNull();
    expect(item.statusColor).toBeNull();
  });
});

describe("sortedTaskTimelineItems", () => {
  test("sorts tasks by start date (earliest first)", () => {
    const later = task({ id: "later", title: "Later", startDate: createContextualDate("2026-02-01", "day") });
    const earlier = task({ id: "earlier", title: "Earlier", startDate: createContextualDate("2026-01-01", "day") });

    expect(sortedTaskTimelineItems([later, earlier]).map((item) => item.id)).toEqual(["earlier", "later"]);
  });
});
