import React from "react";
import { useTaskSlideInSelection } from "../hooks/useTaskSlideInSelection";
import { TaskSlideIn } from "../KanbanView/TaskSlideIn";
import type { GetTaskPageProps, TaskSlideInContext } from "../KanbanView/types";
import { MilestoneViewSelector, type MilestoneViewSelectorMilestone } from "../components/MilestoneViewSelector";
import { TaskDisplayMenu } from "../components";
import type { NewMilestonePayload, TaskDisplayMode } from "../types";
import { TaskGanttChart } from "./TaskGanttChart";

export type TasksGanttViewProps = TaskSlideInContext & {
  displayMode: TaskDisplayMode;
  onDisplayModeChange: (mode: TaskDisplayMode) => void;
  selectedMilestone: MilestoneViewSelectorMilestone | null;
  onMilestoneFilterChange: (milestoneId: string | null) => void;
  canCreateMilestone: boolean;
  onCreateMilestone: (
    milestone: NewMilestonePayload,
  ) =>
    | void
    | { success?: boolean; milestone?: { id: string } }
    | Promise<void | { success?: boolean; milestone?: { id: string } }>;
  getTaskPageProps: GetTaskPageProps;
  testId?: string;
};

export function TasksGanttView({
  displayMode,
  onDisplayModeChange,
  selectedMilestone,
  onMilestoneFilterChange,
  canCreateMilestone,
  onCreateMilestone,
  getTaskPageProps,
  testId,
  milestones = [],
  ...ctx
}: TasksGanttViewProps) {
  const { selectedTaskId, setSelectedTaskId } = useTaskSlideInSelection({
    tasks: ctx.tasks,
    enabled: Boolean(getTaskPageProps),
  });

  const taskSlideInContext: TaskSlideInContext = { ...ctx, milestones };
  const taskPageProps = selectedTaskId ? getTaskPageProps(selectedTaskId, taskSlideInContext) : null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden" data-test-id={testId}>
      <div className="flex items-center justify-between gap-2 border-b border-surface-outline px-4 py-2">
        <MilestoneViewSelector
          milestones={milestones}
          selectedMilestone={selectedMilestone}
          canCreateMilestone={canCreateMilestone}
          onChange={onMilestoneFilterChange}
          onCreateMilestone={onCreateMilestone}
        />
        <TaskDisplayMenu mode={displayMode} onChange={onDisplayModeChange} />
      </div>

      <div className="flex-1 overflow-auto">
        <TaskGanttChart tasks={ctx.tasks} onTaskSelect={setSelectedTaskId} />
      </div>

      <TaskSlideIn
        isOpen={Boolean(selectedTaskId)}
        onClose={() => setSelectedTaskId(null)}
        taskPageProps={taskPageProps}
      />
    </div>
  );
}
