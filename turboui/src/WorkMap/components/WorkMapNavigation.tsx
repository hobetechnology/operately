import React from "react";
import { useLocation } from "react-router";
import { SecondaryButton } from "../../Button";
import { IconFileSpreadsheet, IconTable, IconTimeline } from "../../icons";
import { Tabs, TabsState } from "../../Tabs";
import { ViewToggle } from "../../ViewToggle";
import { WorkMap } from ".";

export interface Props {
  tabsState: TabsState;
  timelineAvailable?: boolean;
  view?: WorkMap.View;
  onExport?: () => void;
}

export function WorkMapNavigation({ tabsState, timelineAvailable = false, view = "table", onExport }: Props) {
  const location = useLocation();
  const tablePath = buildViewPath(location.pathname, location.search, "table");
  const timelinePath = buildViewPath(location.pathname, location.search, "timeline");

  return (
    <div className="flex items-center justify-between gap-4 border-b border-stroke-base px-4 shadow-b-xs">
      <div className="min-w-0 flex-1 overflow-x-auto">
        <Tabs tabs={tabsState} showBorder={false} />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {timelineAvailable && (
          <ViewToggle
            className="my-2"
            value={view}
            ariaLabel="Work map view"
            options={[
              { value: "table", label: "Table", icon: <IconTable size={14} />, to: tablePath },
              { value: "timeline", label: "Timeline", icon: <IconTimeline size={14} />, to: timelinePath },
            ]}
          />
        )}

        {onExport && (
          <SecondaryButton size="xs" icon={IconFileSpreadsheet} onClick={onExport} testId="export-work-map-button">
            Export
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}

export default WorkMapNavigation;

function buildViewPath(pathname: string, search: string, view: WorkMap.View) {
  const searchParams = new URLSearchParams(search);

  if (view === "timeline") {
    searchParams.set("view", "timeline");
  } else {
    searchParams.delete("view");
  }

  const nextSearch = searchParams.toString();
  return nextSearch ? `${pathname}?${nextSearch}` : pathname;
}
