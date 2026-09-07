import { EVENT_STATUS_LABEL, type EventStatus } from "@/types";

const DOT_COLOR: Record<EventStatus, string> = {
  draft: "var(--c-muted)",
  published: "var(--c-accent)",
  ongoing: "var(--c-warning)",
  completed: "var(--c-success)",
  cancelled: "var(--c-danger)",
};

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className="badge">
      <span className="badge__dot" style={{ background: DOT_COLOR[status] }} />
      {EVENT_STATUS_LABEL[status]}
    </span>
  );
}
