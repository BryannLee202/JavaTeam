import type { ReactNode } from "react";

export function Spinner({ label = "Đang tải…" }: { label?: string }) {
  return (
    <div className="spinner-row" role="status">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {hint && <p className="empty-state__hint">{hint}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn--ghost" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}
