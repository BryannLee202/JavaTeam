import type { ReactNode } from "react";
import { Button } from "./Button";

export type FeedbackState = "loading" | "empty" | "error";

export interface StateFeedbackProps {
  state: FeedbackState;
  title?: string;
  message?: string;
  icon?: ReactNode;
  onRetry?: () => void;
  retryText?: string;
  action?: ReactNode;
  className?: string;
}

export function StateFeedback({
  state,
  title,
  message,
  icon,
  onRetry,
  retryText = "Thử lại",
  action,
  className = "",
}: StateFeedbackProps) {
  if (state === "loading") {
    return (
      <div
        className={`state-feedback loading ${className}`.trim()}
        role="status"
        aria-live="polite"
      >
        <div className="state-feedback-spinner" aria-hidden="true">
          <svg
            className="animate-spin"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeOpacity="0.2"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              opacity="0.8"
            />
          </svg>
        </div>
        <div className="state-feedback-text">
          <div className="state-feedback-title">
            {title || "Đang tải dữ liệu..."}
          </div>
          {message && <div className="state-feedback-message">{message}</div>}
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div
        className={`state-feedback error ${className}`.trim()}
        role="alert"
      >
        <div className="state-feedback-icon" aria-hidden="true">
          {icon || (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>
        <div className="state-feedback-text">
          <div className="state-feedback-title">
            {title || "Đã xảy ra lỗi"}
          </div>
          {message && <div className="state-feedback-message">{message}</div>}
        </div>
        {(onRetry || action) && (
          <div className="state-feedback-actions">
            {onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry}>
                {retryText}
              </Button>
            )}
            {action}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`state-feedback empty ${className}`.trim()}
      role="status"
    >
      <div className="state-feedback-icon" aria-hidden="true">
        {icon || (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20 12V8H4v4m16 0v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16 0h-4a2 2 0 01-2-2 2 2 0 00-4 0 2 2 0 01-2 2H4" />
          </svg>
        )}
      </div>
      <div className="state-feedback-text">
        <div className="state-feedback-title">
          {title || "Chưa có dữ liệu"}
        </div>
        {message && <div className="state-feedback-message">{message}</div>}
      </div>
      {action && <div className="state-feedback-actions">{action}</div>}
    </div>
  );
}
