import type { TaskBoard } from "../components";
import { compareTimelineItems, type TimelineDatedItem } from "../../WorkMap/utils/timeline";

export interface TaskTimelineItem extends TimelineDatedItem {
  id: string;
  link: string;
  statusColor: TaskBoard.Status["color"] | null;
}

export function toTaskTimelineItem(task: TaskBoard.Task): TaskTimelineItem {
  return {
    id: task.id,
    name: task.title,
    link: task.link,
    startDate: task.startDate?.date ?? null,
    endDate: task.dueDate?.date ?? null,
    statusColor: task.status?.color ?? null,
  };
}

export function sortedTaskTimelineItems(tasks: TaskBoard.Task[]): TaskTimelineItem[] {
  return tasks.map(toTaskTimelineItem).sort(compareTimelineItems);
}
