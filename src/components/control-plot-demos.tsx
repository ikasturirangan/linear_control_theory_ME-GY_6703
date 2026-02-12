"use client";

import { useMemo, useState } from "react";

type Point = {
  x: number;
  y: number;
};

type ComplexPoint = {
  real: number;
  imag: number;
};

type BodePoint = {
  freq: number;
  magDb: number;
  phaseDeg: number;
};

const STEP_CHART = {
  width: 620,
  height: 300,
  padding: 42,
};

const POLE_CHART = {
  width: 620,
  height: 320,
  padding: 42,
};

const BODE_CHART = {
  width: 620,
  height: 220,
  padding: 42,
};

function secondOrderStepResponse(t: number, zeta: number, wn: number): number {
  if (zeta < 1) {
    const root = Math.sqrt(1 - zeta * zeta);
    const wd = wn * root;
    const phi = Math.atan2(root, zeta);
    return 1 - (Math.exp(-zeta * wn * t) / root) * Math.sin(wd * t + phi);
  }

  if (Math.abs(zeta - 1) < 1e-6) {
    return 1 - Math.exp(-wn * t) * (1 + wn * t);
  }

  const root = Math.sqrt(zeta * zeta - 1);
  const s1 = -wn * (zeta - root);
  const s2 = -wn * (zeta + root);
  return 1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1);
}

function stepPoints(horizon: number, zeta: number, wn: number): Point[] {
  const samples = 260;
  return Array.from({ length: samples + 1 }, (_, i) => {
    const x = (i / samples) * horizon;
    const y = secondOrderStepResponse(x, zeta, wn);
    return { x, y };
  });
}

function formatNumber(value: number, digits = 3): string {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return value.toFixed(digits);
}

function toStepPolyline(points: Point[], horizon: number): string {
  const { width, height, padding } = STEP_CHART;
  const yMin = -0.2;
  const yMax = 1.8;
  const xSpan = width - padding * 2;
  const ySpan = height - padding * 2;

  return points
    .map((p) => {
      const px = padding + (p.x / horizon) * xSpan;
      const py = height - padding - ((p.y - yMin) / (yMax - yMin)) * ySpan;
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");
}

function overshoot(zeta: number): number {
  if (zeta <= 0 || zeta >= 1) {
    return 0;
  }
  return Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta)) * 100;
}

function settlingTime(zeta: number, wn: number): number {
  if (zeta <= 0 || wn <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return 4 / (zeta * wn);
}

function closedLoopPoles(gain: number): ComplexPoint[] {
  if (gain <= 1) {
    const root = Math.sqrt(1 - gain);
    return [
      { real: -2 + root, imag: 0 },
      { real: -2 - root, imag: 0 },
    ];
  }

  const imag = Math.sqrt(gain - 1);
  return [
    { real: -2, imag },
    { real: -2, imag: -imag },
  ];
}

function poleRegionText(gain: number): string {
  if (Math.abs(gain - 1) < 1e-6) {
    return "Critical boundary (repeated real pole).";
  }
  if (gain < 1) {
    return "Two distinct real poles (non-oscillatory response).";
  }
  return "Complex-conjugate poles (damped oscillation).";
}

function toPoleCoords(point: ComplexPoint): Point {
  const realMin = -6;
  const realMax = 1;
  const imagMin = -4;
  const imagMax = 4;
  const { width, height, padding } = POLE_CHART;

  const x =
    padding +
    ((point.real - realMin) / (realMax - realMin)) * (width - 2 * padding);
  const y =
    height -
    padding -
    ((point.imag - imagMin) / (imagMax - imagMin)) * (height - 2 * padding);

  return { x, y };
}

function logspace(startExp: number, endExp: number, count: number): number[] {
  if (count < 2) {
    return [10 ** startExp];
  }

  return Array.from({ length: count }, (_, i) => {
    const alpha = i / (count - 1);
    return 10 ** (startExp + alpha * (endExp - startExp));
  });
}

function bodePoints(gainDb: number, w1: number, w2: number): BodePoint[] {
  const k = 10 ** (gainDb / 20);
  const freqs = logspace(-1, 2, 240);

  return freqs.map((freq) => {
    const m1 = 1 / Math.sqrt(1 + (freq / w1) ** 2);
    const m2 = 1 / Math.sqrt(1 + (freq / w2) ** 2);
    const magDb = 20 * Math.log10(k * m1 * m2);
    const phaseDeg =
      -((Math.atan(freq / w1) + Math.atan(freq / w2)) * 180) / Math.PI;

    return { freq, magDb, phaseDeg };
  });
}

function mapBodeX(freq: number): number {
  const { width, padding } = BODE_CHART;
  const xMin = -1;
  const xMax = 2;
  const x = Math.log10(freq);
  return padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
}

function bodePolyline(
  points: BodePoint[],
  yMin: number,
  yMax: number,
  chartHeight: number,
): string {
  const { padding, width } = BODE_CHART;
  const ySpan = chartHeight - 2 * padding;
  const xSpan = width - 2 * padding;

  return points
    .map((p) => {
      const x = padding + ((Math.log10(p.freq) + 1) / 3) * xSpan;
      const y =
        chartHeight - padding - ((p.magDb - yMin) / (yMax - yMin)) * ySpan;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function phasePolyline(points: BodePoint[]): string {
  const { padding, width, height } = BODE_CHART;
  const yMin = -200;
  const yMax = 10;
  const ySpan = height - 2 * padding;
  const xSpan = width - 2 * padding;

  return points
    .map((p) => {
      const x = padding + ((Math.log10(p.freq) + 1) / 3) * xSpan;
      const y = height - padding - ((p.phaseDeg - yMin) / (yMax - yMin)) * ySpan;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function findGainCrossover(points: BodePoint[]): number | null {
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    if ((prev.magDb >= 0 && curr.magDb <= 0) || (prev.magDb <= 0 && curr.magDb >= 0)) {
      const ratio = (0 - prev.magDb) / (curr.magDb - prev.magDb);
      return prev.freq + ratio * (curr.freq - prev.freq);
    }
  }
  return null;
}

function phaseAtFrequency(
  freq: number,
  w1: number,
  w2: number,
): number {
  return -((Math.atan(freq / w1) + Math.atan(freq / w2)) * 180) / Math.PI;
}

export function StepResponseDemo() {
  const [zeta, setZeta] = useState(0.45);
  const [wn, setWn] = useState(2.2);
  const [horizon, setHorizon] = useState(8);

  const points = useMemo(() => stepPoints(horizon, zeta, wn), [horizon, zeta, wn]);
  const polyline = useMemo(() => toStepPolyline(points, horizon), [points, horizon]);

  const mp = overshoot(zeta);
  const ts = settlingTime(zeta, wn);

  const targetY =
    STEP_CHART.height -
    STEP_CHART.padding -
    ((1 - -0.2) / (1.8 - -0.2)) * (STEP_CHART.height - STEP_CHART.padding * 2);

  return (
    <section
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        marginBottom: 20,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Step Response Slider</h3>
      <p style={{ marginTop: 0 }}>
        Adjust damping ratio <code>zeta</code> and natural frequency <code>wn</code>.
        The plot shows the unit-step response of a second-order model.
      </p>

      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <label>
          zeta: <strong>{zeta.toFixed(2)}</strong>
          <input
            type="range"
            min="0.05"
            max="1.60"
            step="0.01"
            value={zeta}
            onChange={(e) => setZeta(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          wn (rad/s): <strong>{wn.toFixed(2)}</strong>
          <input
            type="range"
            min="0.40"
            max="8.00"
            step="0.05"
            value={wn}
            onChange={(e) => setWn(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          time window (s): <strong>{horizon.toFixed(1)}</strong>
          <input
            type="range"
            min="3.0"
            max="20.0"
            step="0.5"
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <svg
        viewBox={`0 0 ${STEP_CHART.width} ${STEP_CHART.height}`}
        style={{ width: "100%", height: "auto", background: "#ffffff" }}
      >
        <line
          x1={STEP_CHART.padding}
          y1={STEP_CHART.height - STEP_CHART.padding}
          x2={STEP_CHART.width - STEP_CHART.padding}
          y2={STEP_CHART.height - STEP_CHART.padding}
          stroke="#9ca3af"
        />
        <line
          x1={STEP_CHART.padding}
          y1={STEP_CHART.padding}
          x2={STEP_CHART.padding}
          y2={STEP_CHART.height - STEP_CHART.padding}
          stroke="#9ca3af"
        />
        <line
          x1={STEP_CHART.padding}
          y1={targetY}
          x2={STEP_CHART.width - STEP_CHART.padding}
          y2={targetY}
          stroke="#94a3b8"
          strokeDasharray="6 4"
        />
        <polyline
          points={polyline}
          fill="none"
          stroke="#0f766e"
          strokeWidth="2.5"
        />
      </svg>

      <p style={{ marginBottom: 0 }}>
        Estimated overshoot: <strong>{formatNumber(mp, 1)}%</strong> | Estimated 2%
        settling time: <strong>{formatNumber(ts, 2)} s</strong>
      </p>
    </section>
  );
}

export function PoleMovementDemo() {
  const [gain, setGain] = useState(0.5);

  const poles = useMemo(() => closedLoopPoles(gain), [gain]);
  const coords = poles.map(toPoleCoords);

  const imagMagnitude = Math.abs(poles[0]?.imag ?? 0);

  return (
    <section
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        marginBottom: 20,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Pole Movement Slider</h3>
      <p style={{ marginTop: 0 }}>
        Plant model: <code>G(s) = K/((s+1)(s+3))</code> with unity feedback. The
        closed-loop characteristic equation is <code>s^2 + 4s + (3+K) = 0</code>.
      </p>

      <label>
        gain K: <strong>{gain.toFixed(2)}</strong>
        <input
          type="range"
          min="0.00"
          max="8.00"
          step="0.05"
          value={gain}
          onChange={(e) => setGain(Number(e.target.value))}
          style={{ width: "100%", marginTop: 6 }}
        />
      </label>

      <svg
        viewBox={`0 0 ${POLE_CHART.width} ${POLE_CHART.height}`}
        style={{ width: "100%", height: "auto", background: "#ffffff", marginTop: 12 }}
      >
        <line
          x1={POLE_CHART.padding}
          y1={POLE_CHART.height / 2}
          x2={POLE_CHART.width - POLE_CHART.padding}
          y2={POLE_CHART.height / 2}
          stroke="#9ca3af"
        />
        <line
          x1={POLE_CHART.padding + ((0 - -6) / (1 - -6)) * (POLE_CHART.width - 2 * POLE_CHART.padding)}
          y1={POLE_CHART.padding}
          x2={POLE_CHART.padding + ((0 - -6) / (1 - -6)) * (POLE_CHART.width - 2 * POLE_CHART.padding)}
          y2={POLE_CHART.height - POLE_CHART.padding}
          stroke="#9ca3af"
        />

        {coords.map((p, i) => (
          <g key={`${i}-${p.x}-${p.y}`}>
            <circle cx={p.x} cy={p.y} r="6" fill="#b91c1c" />
            <line x1={p.x - 8} y1={p.y - 8} x2={p.x + 8} y2={p.y + 8} stroke="#ffffff" strokeWidth="1.5" />
            <line x1={p.x + 8} y1={p.y - 8} x2={p.x - 8} y2={p.y + 8} stroke="#ffffff" strokeWidth="1.5" />
          </g>
        ))}
      </svg>

      <p>
        Pole 1: <code>{formatNumber(poles[0]?.real ?? 0, 3)} {poles[0]!.imag >= 0 ? "+" : "-"} j{formatNumber(Math.abs(poles[0]?.imag ?? 0), 3)}</code>
      </p>
      <p>
        Pole 2: <code>{formatNumber(poles[1]?.real ?? 0, 3)} {poles[1]!.imag >= 0 ? "+" : "-"} j{formatNumber(Math.abs(poles[1]?.imag ?? 0), 3)}</code>
      </p>
      <p style={{ marginBottom: 0 }}>
        Region: <strong>{poleRegionText(gain)}</strong> Oscillation frequency grows with
        <code> |Im(p)| = {formatNumber(imagMagnitude, 3)}</code> when poles are complex.
      </p>
    </section>
  );
}

export function BodePlotDemo() {
  const [gainDb, setGainDb] = useState(12);
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(8);

  const points = useMemo(() => bodePoints(gainDb, w1, w2), [gainDb, w1, w2]);
  const magLine = useMemo(
    () => bodePolyline(points, -80, 30, BODE_CHART.height),
    [points],
  );
  const phaseLine = useMemo(() => phasePolyline(points), [points]);

  const crossover = findGainCrossover(points);
  const phaseMargin =
    crossover === null ? null : 180 + phaseAtFrequency(crossover, w1, w2);

  const xTicks = [0.1, 1, 10, 100];

  return (
    <section
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        marginBottom: 20,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Bode Plot Slider</h3>
      <p style={{ marginTop: 0 }}>
        Model: <code>G(s)=K/((1+s/w1)(1+s/w2))</code>. Move gain and corner
        frequencies to see magnitude and phase changes.
      </p>

      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <label>
          gain (dB): <strong>{gainDb.toFixed(1)}</strong>
          <input
            type="range"
            min="-20"
            max="30"
            step="0.5"
            value={gainDb}
            onChange={(e) => setGainDb(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          first corner w1 (rad/s): <strong>{w1.toFixed(2)}</strong>
          <input
            type="range"
            min="0.2"
            max="15"
            step="0.1"
            value={w1}
            onChange={(e) => setW1(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          second corner w2 (rad/s): <strong>{w2.toFixed(2)}</strong>
          <input
            type="range"
            min="0.3"
            max="20"
            step="0.1"
            value={w2}
            onChange={(e) => setW2(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <h4 style={{ marginBottom: 6 }}>Magnitude (dB)</h4>
      <svg
        viewBox={`0 0 ${BODE_CHART.width} ${BODE_CHART.height}`}
        style={{ width: "100%", height: "auto", background: "#ffffff" }}
      >
        <line
          x1={BODE_CHART.padding}
          y1={BODE_CHART.height - BODE_CHART.padding}
          x2={BODE_CHART.width - BODE_CHART.padding}
          y2={BODE_CHART.height - BODE_CHART.padding}
          stroke="#9ca3af"
        />
        <line
          x1={BODE_CHART.padding}
          y1={BODE_CHART.padding}
          x2={BODE_CHART.padding}
          y2={BODE_CHART.height - BODE_CHART.padding}
          stroke="#9ca3af"
        />
        <line
          x1={BODE_CHART.padding}
          y1={BODE_CHART.height - BODE_CHART.padding - ((0 - -80) / 110) * (BODE_CHART.height - 2 * BODE_CHART.padding)}
          x2={BODE_CHART.width - BODE_CHART.padding}
          y2={BODE_CHART.height - BODE_CHART.padding - ((0 - -80) / 110) * (BODE_CHART.height - 2 * BODE_CHART.padding)}
          stroke="#94a3b8"
          strokeDasharray="6 4"
        />
        {xTicks.map((tick) => {
          const x = mapBodeX(tick);
          return (
            <g key={`mag-${tick}`}>
              <line
                x1={x}
                y1={BODE_CHART.padding}
                x2={x}
                y2={BODE_CHART.height - BODE_CHART.padding}
                stroke="#e5e7eb"
              />
              <text
                x={x}
                y={BODE_CHART.height - BODE_CHART.padding + 16}
                textAnchor="middle"
                fontSize="11"
                fill="#334155"
              >
                {tick}
              </text>
            </g>
          );
        })}
        <polyline
          points={magLine}
          fill="none"
          stroke="#0f766e"
          strokeWidth="2.5"
        />
      </svg>

      <h4 style={{ marginTop: 14, marginBottom: 6 }}>Phase (deg)</h4>
      <svg
        viewBox={`0 0 ${BODE_CHART.width} ${BODE_CHART.height}`}
        style={{ width: "100%", height: "auto", background: "#ffffff" }}
      >
        <line
          x1={BODE_CHART.padding}
          y1={BODE_CHART.height - BODE_CHART.padding}
          x2={BODE_CHART.width - BODE_CHART.padding}
          y2={BODE_CHART.height - BODE_CHART.padding}
          stroke="#9ca3af"
        />
        <line
          x1={BODE_CHART.padding}
          y1={BODE_CHART.padding}
          x2={BODE_CHART.padding}
          y2={BODE_CHART.height - BODE_CHART.padding}
          stroke="#9ca3af"
        />
        {xTicks.map((tick) => {
          const x = mapBodeX(tick);
          return (
            <g key={`phase-${tick}`}>
              <line
                x1={x}
                y1={BODE_CHART.padding}
                x2={x}
                y2={BODE_CHART.height - BODE_CHART.padding}
                stroke="#e5e7eb"
              />
              <text
                x={x}
                y={BODE_CHART.height - BODE_CHART.padding + 16}
                textAnchor="middle"
                fontSize="11"
                fill="#334155"
              >
                {tick}
              </text>
            </g>
          );
        })}
        <polyline
          points={phaseLine}
          fill="none"
          stroke="#b45309"
          strokeWidth="2.5"
        />
      </svg>

      <p style={{ marginBottom: 0 }}>
        Gain crossover:
        <strong>
          {" "}
          {crossover === null ? "none in plotted range" : `${formatNumber(crossover, 3)} rad/s`}
        </strong>
        {" | "}Estimated phase margin:
        <strong>
          {" "}
          {phaseMargin === null ? "N/A" : `${formatNumber(phaseMargin, 1)} deg`}
        </strong>
      </p>
    </section>
  );
}
