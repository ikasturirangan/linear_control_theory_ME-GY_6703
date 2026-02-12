"use client";

import { type ReactNode, useState } from "react";

type EquationHelpProps = {
  hint: string;
  children: ReactNode;
  label?: string;
};

export function EquationHelp({
  hint,
  children,
  label = "Hover or tap for insight",
}: EquationHelpProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{
        background: "#f8fafc",
        border: "1px solid #dbe3ea",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 14,
        padding: "10px 12px",
        position: "relative",
      }}
      tabIndex={0}
    >
      <button
        aria-label="Toggle equation explanation"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          background: "#0f766e",
          border: "none",
          borderRadius: 999,
          color: "#ffffff",
          cursor: "pointer",
          fontSize: 12,
          padding: "4px 10px",
          position: "absolute",
          right: 10,
          top: 8,
        }}
        type="button"
      >
        {label}
      </button>

      <div style={{ marginTop: 26 }}>{children}</div>

      {open ? (
        <div
          role="tooltip"
          style={{
            background: "#111827",
            borderRadius: 8,
            color: "#f9fafb",
            fontSize: 13,
            marginTop: 8,
            padding: "8px 10px",
          }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}
