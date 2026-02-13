"use client";

import type { CSSProperties, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export type ChartConfig = Record<
  string,
  {
    color: string;
    label: string;
  }
>;

type ChartContainerProps = {
  children: ReactNode;
  config: ChartConfig;
  style?: CSSProperties;
};

type ChartTooltipEntry = {
  color?: string;
  dataKey?: string;
  name?: string;
  payload?: Record<string, unknown>;
  value?: number | string;
};

type ChartTooltipContentProps = {
  active?: boolean;
  config?: ChartConfig;
  label?: number | string;
  payload?: ChartTooltipEntry[];
};

function cssVarsFromConfig(config: ChartConfig): CSSProperties {
  return Object.fromEntries(
    Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color]),
  ) as CSSProperties;
}

export function ChartContainer({ children, config, style }: ChartContainerProps) {
  return (
    <div
      style={{
        border: "1px solid #dbe2ea",
        borderRadius: 12,
        background:
          "linear-gradient(180deg, rgba(248,250,252,0.85) 0%, rgba(255,255,255,0.96) 100%)",
        padding: 12,
        marginBottom: 12,
        ...cssVarsFromConfig(config),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function ChartLegend({
  config,
  style,
}: {
  config: ChartConfig;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 10,
        ...style,
      }}
    >
      {Object.entries(config).map(([key, value]) => (
        <Badge
          key={key}
          style={{
            background: value.color,
            borderColor: "transparent",
            color: "#ffffff",
          }}
        >
          {value.label}
        </Badge>
      ))}
    </div>
  );
}

export function ChartTooltipContent({
  active,
  config,
  label,
  payload,
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 10,
        background: "#ffffff",
        boxShadow: "0 10px 18px rgba(15, 23, 42, 0.1)",
        padding: "0.55rem 0.65rem",
        minWidth: 136,
      }}
    >
      {label !== undefined ? (
        <div
          style={{
            color: "#334155",
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          {typeof label === "number" ? label.toFixed(3) : label}
        </div>
      ) : null}
      <div style={{ display: "grid", gap: 4 }}>
        {payload.map((entry, index) => {
          const key = typeof entry.dataKey === "string" ? entry.dataKey : "";
          const configEntry = key ? config?.[key] : undefined;
          const displayName =
            configEntry?.label ??
            (typeof entry.name === "string" ? entry.name : key || `Series ${index + 1}`);
          const displayValue =
            typeof entry.value === "number"
              ? entry.value.toFixed(3)
              : String(entry.value ?? "-");
          const color = configEntry?.color ?? entry.color ?? "#0f766e";

          return (
            <div
              key={`${displayName}-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 12,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 9999,
                    background: color,
                  }}
                />
                <span style={{ color: "#334155", fontWeight: 600 }}>{displayName}</span>
              </span>
              <span style={{ color: "#0f172a", fontWeight: 700 }}>{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
