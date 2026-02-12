"use client";

import { useEffect, useMemo, useState } from "react";

type TrackerItem = {
  id: string;
  title: string;
  hours: number;
};

type TrackerState = Record<string, boolean>;

const STORAGE_KEY = "lct_syllabus_tracker_v1";

const ITEMS: TrackerItem[] = [
  {
    id: "3-1",
    title:
      "Modeling, ODE, Transfer Function, Command & Disturbance Responses, Simulink",
    hours: 3,
  },
  {
    id: "3-2",
    title: "Steady-State Error, Closed-Loop Transfer Function, System Performance",
    hours: 3,
  },
  { id: "3-3", title: "Bode Plot and Relative Stability", hours: 3 },
  { id: "3-4", title: "Frequency-Domain Controller Design", hours: 3 },
  { id: "3-5", title: "Routh Criterion and Nyquist Diagram", hours: 3 },
  {
    id: "3-6",
    title: "Digital Controller Representation, Difference Equations",
    hours: 3,
  },
  { id: "3-7", title: "Jury Test, Sampled-Data Control, Z-Transform", hours: 3 },
  { id: "3-8", title: "Sampling, ZOH, A/D and D/A Converters", hours: 3 },
  {
    id: "3-9",
    title: "State-Transition Matrix, State-Space Representation",
    hours: 3,
  },
  { id: "3-10", title: "Continuous-to-Discrete Conversion, DTSS", hours: 3 },
  {
    id: "3-11",
    title: "Controllability, Observability, Ackermann's Formula",
    hours: 3,
  },
  { id: "3-12", title: "Pole Placement and Full-State Observer Design", hours: 3 },
  { id: "3-13", title: "LQR and MPC", hours: 3 },
  { id: "lab", title: "Extra Lab: Inverted Pendulum Balancing", hours: 2 },
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

  const completedModules = useMemo(
    () => ITEMS.filter((item) => state[item.id]).length,
    [state],
  );
  const totalModules = ITEMS.length;
  const modulePercent = Math.round((completedModules / totalModules) * 100);

  const totalHours = useMemo(
    () => ITEMS.reduce((sum, item) => sum + item.hours, 0),
    [],
  );
  const completedHours = useMemo(
    () =>
      ITEMS.reduce(
        (sum, item) => (state[item.id] ? sum + item.hours : sum),
        0,
      ),
    [state],
  );
  const hourPercent = Math.round((completedHours / totalHours) * 100);

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
        Module progress: <strong>{completedModules}</strong> of{" "}
        <strong>{totalModules}</strong> ({modulePercent}%).
        <br />
        Hours progress: <strong>{completedHours}</strong> of{" "}
        <strong>{totalHours}</strong> hours ({hourPercent}%).
        Progress is saved in your browser.
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
            width: `${hourPercent}%`,
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
              <strong>{item.id}</strong> ({item.hours}h): {item.title}
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
