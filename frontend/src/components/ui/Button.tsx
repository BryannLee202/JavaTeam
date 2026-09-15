import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "secondary"
      ? "secondary"
      : variant === "danger"
      ? "danger"
      : variant === "outline"
      ? "secondary outline"
      : variant === "ghost"
      ? "secondary ghost"
      : "";

  const sizeClass = size === "sm" ? "small" : size === "lg" ? "large" : "";

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" role="status" aria-label="Loading">
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeOpacity="0.25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              opacity="0.75"
            />
          </svg>
        </span>
      ) : leftIcon ? (
        <span className="btn-icon-left">{leftIcon}</span>
      ) : null}
      <span className="btn-label">{children}</span>
      {!isLoading && rightIcon ? (
        <span className="btn-icon-right">{rightIcon}</span>
      ) : null}
    </button>
  );
}
