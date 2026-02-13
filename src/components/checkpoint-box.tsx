"use client";

import type { ReactNode } from "react";

type CheckpointBoxProps = {
  children: ReactNode;
  title?: string;
};

export function CheckpointBox({
  children,
  title = "Checkpoint",
}: CheckpointBoxProps) {
  return (
    <aside
      style={{
        border: "1px solid #bae6fd",
        borderRadius: 10,
        background: "linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)",
        padding: "0.85rem 0.95rem",
        marginTop: 12,
        marginBottom: 14,
      }}
    >
      <p
        style={{
          marginTop: 0,
          marginBottom: 8,
          color: "#0c4a6e",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {title}
      </p>
      <div style={{ marginBottom: 0 }}>{children}</div>
    </aside>
  );
}
