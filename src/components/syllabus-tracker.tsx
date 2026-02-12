"use client";

import { useEffect, useMemo, useState } from "react";

type TrackerItem = {
  id: string;
  title: string;
};

type TrackerState = Record<string, boolean>;

const STORAGE_KEY = "lct_syllabus_tracker_v1";

const ITEMS: TrackerItem[] = [
  { id: "3-1", title: "Modeling, ODE, Transfer Function, Command & Disturbance Responses, Simulink" },
  { id: "3-2", title: "Steady-State Error, Closed-Loop Transfer Function, System Performance" },
  { id: "3-3", title: "Bode Plot and Relative Stability" },
  { id: "3-4", title: "Frequency-Domain Controller Design" },
  { id: "3-5", title: "Routh Criterion and Nyquist Diagram" },
  { id: "3-6", title: "Digital Controller Representation, Difference Equations" },
  { id: "3-7", title: "Jury Test, Sampled-Data Control, Z-Transform" },
  { id: "3-8", title: "Sampling, ZOH, A/D and D/A Converters" },
  { id: "3-9", title: "State-Transition Matrix, State-Space Representation" },
  { id: "3-10", title: "Continuous-to-Discrete Conversion, DTSS" },
  { id: "3-11", title: "Controllability, Observability, Ackermann's Formula" },
  { id: "3-12", title: "Pole Placement and Full-State Observer Design" },
  { id: "3-13", title: "LQR and MPC" },
  { id: "lab", title: "Extra Lab: Inverted Pendulum Balancing" },
];

function buildInitialState(): TrackerState {
  return ITEMS.reduce<TrackerState>((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});
}

export function SyllabusTracker() {
  const [state, setState] = useState<TrackerState>(() => buildInitialState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<TrackerState>;
      setState((prev) => {
        const next: TrackerState = { ...prev };
        for (const item of ITEMS) {
          const value = parsed[item.id];
          if (typeof value === "boolean") {
            next[item.id] = value;
          }
        }
        return next;
      });
    } catch {
      // Ignore storage parse errors and keep defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const completed = useMemo(
    () => ITEMS.filter((item) => state[item.id]).length,
    [state],
  );
  const total = ITEMS.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <section
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 12,
        marginBottom: 18,
        marginTop: 10,
        padding: 16,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Syllabus Progress Tracker</h3>
      <p style={{ marginTop: 0 }}>
        Completed <strong>{completed}</strong> of <strong>{total}</strong> modules
        ({percent}%). Progress is saved in your browser.
      </p>

      <div
        style={{
          background: "#e2e8f0",
          borderRadius: 999,
          height: 10,
          marginBottom: 14,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#0f766e",
            height: "100%",
            transition: "width 180ms ease",
            width: `${percent}%`,
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {ITEMS.map((item) => (
          <label
            key={item.id}
            style={{
              alignItems: "flex-start",
              cursor: "pointer",
              display: "flex",
              gap: 10,
            }}
          >
            <input
              checked={Boolean(state[item.id])}
              onChange={() => {
                setState((prev) => ({
                  ...prev,
                  [item.id]: !prev[item.id],
                }));
              }}
              type="checkbox"
            />
            <span>
              <strong>{item.id}</strong>: {item.title}
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={() => setState(buildInitialState())}
        style={{
          background: "#dc2626",
          border: "none",
          borderRadius: 8,
          color: "#ffffff",
          cursor: "pointer",
          marginTop: 14,
          padding: "6px 10px",
        }}
        type="button"
      >
        Reset Tracker
      </button>
    </section>
  );
}
