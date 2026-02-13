"use client";

import type { CSSProperties, HTMLAttributes } from "react";

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const baseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: 0.2,
  padding: "0.35rem 0.6rem",
  border: "1px solid transparent",
  whiteSpace: "nowrap",
};

const variantStyle: Record<BadgeVariant, CSSProperties> = {
  default: {
    background: "#0f766e",
    color: "#f8fafc",
  },
  secondary: {
    background: "#e2e8f0",
    color: "#0f172a",
  },
  outline: {
    background: "transparent",
    color: "#0f172a",
    borderColor: "#cbd5e1",
  },
  success: {
    background: "#dcfce7",
    color: "#14532d",
    borderColor: "#86efac",
  },
  warning: {
    background: "#fef3c7",
    color: "#92400e",
    borderColor: "#fcd34d",
  },
};

export function Badge({
  children,
  style,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span style={{ ...baseStyle, ...variantStyle[variant], ...style }} {...props}>
      {children}
    </span>
  );
}
