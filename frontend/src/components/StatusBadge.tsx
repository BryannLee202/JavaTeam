import {
  EVENT_STATUS_LABEL,
  TEAM_STATUS_LABEL,
  type EventStatus,
  type TeamStatus,
} from "@/types";

type BadgeStatus = EventStatus | TeamStatus;

const DOT_COLOR: Record<BadgeStatus, string> = {
  draft: "var(--c-muted)",
  published: "var(--c-accent)",
  ongoing: "var(--c-warning)",
  completed: "var(--c-success)",
  cancelled: "var(--c-danger)",

  forming: "var(--c-muted)",
  registered: "var(--c-success)",
  disqualified: "var(--c-danger)",
};

function getStatusLabel(status: BadgeStatus) {
  if (status in EVENT_STATUS_LABEL) {
    return EVENT_STATUS_LABEL[status as EventStatus];
  }

  return TEAM_STATUS_LABEL[status as TeamStatus];
}

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span className="badge">
      <span
        className="badge__dot"
        style={{ background: DOT_COLOR[status] }}
      />
      {getStatusLabel(status)}
    </span>
  );
}
