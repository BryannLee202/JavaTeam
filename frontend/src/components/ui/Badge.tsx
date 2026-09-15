import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "primary" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
}

export function Badge({
  variant = "neutral",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={`badge ${variant} ${className}`.trim()} {...props}>
      {dot && <span className="badge-dot" aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", marginRight: 6, display: "inline-block" }} />}
      {children}
    </span>
  );
}
