"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StepPoint = {
  response: number;
  time: number;
};

type ComplexPoint = {
  imag: number;
  real: number;
};

type BodePoint = {
  freq: number;
  logFreq: number;
  magDb: number;
  phaseDeg: number;
};

type DemoSliderProps = {
  label: string;
  max: number;
  min: number;
  onChange: (nextValue: number) => void;
  step: number;
  value: number;
  valueText: string;
};

const panelStyle: CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: 12,
  padding: 16,
  marginTop: 12,
  marginBottom: 20,
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

function stepPoints(horizon: number, zeta: number, wn: number): StepPoint[] {
  const samples = 240;
  return Array.from({ length: samples + 1 }, (_, i) => {
    const time = (i / samples) * horizon;
    const response = secondOrderStepResponse(time, zeta, wn);
    return { response, time };
  });
}

function formatNumber(value: number, digits = 3): string {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return value.toFixed(digits);
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
  const freqs = logspace(-1, 2, 220);

  return freqs.map((freq) => {
    const m1 = 1 / Math.sqrt(1 + (freq / w1) ** 2);
    const m2 = 1 / Math.sqrt(1 + (freq / w2) ** 2);
    const magDb = 20 * Math.log10(k * m1 * m2);
    const phaseDeg =
      -((Math.atan(freq / w1) + Math.atan(freq / w2)) * 180) / Math.PI;

    return { freq, logFreq: Math.log10(freq), magDb, phaseDeg };
  });
}

function findGainCrossover(points: BodePoint[]): number | null {
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    if (
      (prev.magDb >= 0 && curr.magDb <= 0) ||
      (prev.magDb <= 0 && curr.magDb >= 0)
    ) {
      const ratio = (0 - prev.magDb) / (curr.magDb - prev.magDb);
      return prev.freq + ratio * (curr.freq - prev.freq);
    }
  }
  return null;
}

function phaseAtFrequency(freq: number, w1: number, w2: number): number {
  return -((Math.atan(freq / w1) + Math.atan(freq / w2)) * 180) / Math.PI;
}

function formatFrequencyTick(logFreq: number): string {
  const value = 10 ** logFreq;
  if (value >= 100) {
    return "100";
  }
  if (value >= 10) {
    return "10";
  }
  if (value >= 1) {
    return "1";
  }
  return "0.1";
}

function DemoSlider({
  label,
  max,
  min,
  onChange,
  step,
  value,
  valueText,
}: DemoSliderProps) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span>
        {label}: <strong>{valueText}</strong>
      </span>
      <Slider
        aria-label={label}
        max={max}
        min={min}
        onValueChange={(nextValues) => onChange(nextValues[0] ?? value)}
        step={step}
        value={[value]}
      />
    </label>
  );
}

export function StepResponseDemo() {
  const [zeta, setZeta] = useState(0.45);
  const [wn, setWn] = useState(2.2);
  const [horizon, setHorizon] = useState(8);

  const data = useMemo(() => stepPoints(horizon, zeta, wn), [horizon, zeta, wn]);

  const chartConfig: ChartConfig = {
    response: { color: "#0f766e", label: "Step response" },
    target: { color: "#64748b", label: "Target (y=1)" },
  };

  const mp = overshoot(zeta);
  const ts = settlingTime(zeta, wn);

  return (
    <section style={panelStyle}>
      <h3 style={{ marginTop: 0 }}>Step Response Slider</h3>
      <p style={{ marginTop: 0 }}>
        Adjust damping ratio <code>zeta</code> and natural frequency <code>wn</code>.
        The chart uses shadcn-style UI and renders a unit-step response.
      </p>

      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <DemoSlider
          label="zeta"
          max={1.6}
          min={0.05}
          onChange={setZeta}
          step={0.01}
          value={zeta}
          valueText={zeta.toFixed(2)}
        />

        <DemoSlider
          label="wn (rad/s)"
          max={8}
          min={0.4}
          onChange={setWn}
          step={0.05}
          value={wn}
          valueText={wn.toFixed(2)}
        />

        <DemoSlider
          label="time window (s)"
          max={20}
          min={3}
          onChange={setHorizon}
          step={0.5}
          value={horizon}
          valueText={horizon.toFixed(1)}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        <Badge variant={mp < 15 ? "success" : "warning"}>
          Overshoot: {formatNumber(mp, 1)}%
        </Badge>
        <Badge variant="secondary">Settling (2%): {formatNumber(ts, 2)} s</Badge>
      </div>

      <ChartContainer config={chartConfig}>
        <ChartLegend config={chartConfig} />
        <ResponsiveContainer height={280} width="100%">
          <LineChart data={data} margin={{ top: 8, right: 14, bottom: 8, left: 2 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis
              dataKey="time"
              domain={[0, horizon]}
              tickFormatter={(value) => Number(value).toFixed(1)}
              type="number"
            />
            <YAxis domain={[-0.2, 1.8]} />
            <ReferenceLine
              stroke="var(--color-target)"
              strokeDasharray="6 4"
              y={1}
            />
            <RechartsTooltip
              content={<ChartTooltipContent config={chartConfig} />}
            />
            <Line
              dataKey="response"
              dot={false}
              isAnimationActive={false}
              stroke="var(--color-response)"
              strokeWidth={2.6}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quantity</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Damping ratio zeta</TableCell>
            <TableCell>{zeta.toFixed(3)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Natural frequency wn</TableCell>
            <TableCell>{wn.toFixed(3)} rad/s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Estimated 2% settling time</TableCell>
            <TableCell>{formatNumber(ts, 2)} s</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}

export function PoleMovementDemo() {
  const [gain, setGain] = useState(0.5);

  const poles = useMemo(() => closedLoopPoles(gain), [gain]);
  const imagMagnitude = Math.abs(poles[0]?.imag ?? 0);

  const chartConfig: ChartConfig = {
    poles: { color: "#b91c1c", label: "Closed-loop poles" },
  };

  return (
    <section style={panelStyle}>
      <h3 style={{ marginTop: 0 }}>Pole Movement Slider</h3>
      <p style={{ marginTop: 0 }}>
        Plant model: <code>G(s) = K/((s+1)(s+3))</code> with unity feedback.
        The closed-loop characteristic equation is
        <code> s^2 + 4s + (3+K) = 0</code>.
      </p>

      <DemoSlider
        label="gain K"
        max={8}
        min={0}
        onChange={setGain}
        step={0.05}
        value={gain}
        valueText={gain.toFixed(2)}
      />

      <div style={{ marginTop: 10, marginBottom: 8 }}>
        <Badge variant={gain <= 1 ? "secondary" : "warning"}>{poleRegionText(gain)}</Badge>
      </div>

      <ChartContainer config={chartConfig} style={{ marginTop: 10 }}>
        <ChartLegend config={chartConfig} />
        <ResponsiveContainer height={300} width="100%">
          <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 4 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis dataKey="real" domain={[-6, 1]} name="Re" type="number" />
            <YAxis dataKey="imag" domain={[-4, 4]} name="Im" type="number" />
            <ReferenceLine stroke="#9ca3af" x={0} />
            <ReferenceLine stroke="#9ca3af" y={0} />
            <RechartsTooltip
              content={<ChartTooltipContent config={chartConfig} />}
            />
            <Scatter data={poles} dataKey="imag" fill="var(--color-poles)" line={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pole</TableHead>
            <TableHead>Real</TableHead>
            <TableHead>Imag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Pole 1</TableCell>
            <TableCell>{formatNumber(poles[0]?.real ?? 0, 3)}</TableCell>
            <TableCell>{formatNumber(poles[0]?.imag ?? 0, 3)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pole 2</TableCell>
            <TableCell>{formatNumber(poles[1]?.real ?? 0, 3)}</TableCell>
            <TableCell>{formatNumber(poles[1]?.imag ?? 0, 3)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>|Im(p)| (oscillation tendency)</TableCell>
            <TableCell colSpan={2}>{formatNumber(imagMagnitude, 3)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}

export function BodePlotDemo() {
  const [gainDb, setGainDb] = useState(12);
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(8);

  const points = useMemo(() => bodePoints(gainDb, w1, w2), [gainDb, w1, w2]);

  const crossover = findGainCrossover(points);
  const phaseMargin =
    crossover === null ? null : 180 + phaseAtFrequency(crossover, w1, w2);

  const magConfig: ChartConfig = {
    magDb: { color: "#0f766e", label: "Magnitude (dB)" },
  };
  const phaseConfig: ChartConfig = {
    phaseDeg: { color: "#b45309", label: "Phase (deg)" },
  };

  return (
    <section style={panelStyle}>
      <h3 style={{ marginTop: 0 }}>Bode Plot Slider</h3>
      <p style={{ marginTop: 0 }}>
        Model: <code>G(s)=K/((1+s/w1)(1+s/w2))</code>. Move gain and corner
        frequencies to see magnitude and phase changes.
      </p>

      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <DemoSlider
          label="gain (dB)"
          max={30}
          min={-20}
          onChange={setGainDb}
          step={0.5}
          value={gainDb}
          valueText={gainDb.toFixed(1)}
        />

        <DemoSlider
          label="first corner w1 (rad/s)"
          max={15}
          min={0.2}
          onChange={setW1}
          step={0.1}
          value={w1}
          valueText={w1.toFixed(2)}
        />

        <DemoSlider
          label="second corner w2 (rad/s)"
          max={20}
          min={0.3}
          onChange={setW2}
          step={0.1}
          value={w2}
          valueText={w2.toFixed(2)}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <Badge variant="secondary">
          Crossover: {crossover === null ? "none" : `${formatNumber(crossover, 3)} rad/s`}
        </Badge>
        <Badge
          variant={
            phaseMargin === null
              ? "outline"
              : phaseMargin >= 45
                ? "success"
                : "warning"
          }
        >
          PM: {phaseMargin === null ? "N/A" : `${formatNumber(phaseMargin, 1)} deg`}
        </Badge>
      </div>

      <h4 style={{ marginBottom: 6 }}>Magnitude (dB)</h4>
      <ChartContainer config={magConfig}>
        <ChartLegend config={magConfig} />
        <ResponsiveContainer height={250} width="100%">
          <LineChart data={points} margin={{ top: 8, right: 14, bottom: 8, left: 2 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis
              dataKey="logFreq"
              domain={[-1, 2]}
              tickFormatter={(value) => formatFrequencyTick(Number(value))}
              ticks={[-1, 0, 1, 2]}
              type="number"
            />
            <YAxis domain={[-80, 30]} />
            <ReferenceLine stroke="#94a3b8" strokeDasharray="6 4" y={0} />
            <RechartsTooltip
              content={<ChartTooltipContent config={magConfig} />}
            />
            <Line
              dataKey="magDb"
              dot={false}
              isAnimationActive={false}
              stroke="var(--color-magDb)"
              strokeWidth={2.4}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <h4 style={{ marginTop: 14, marginBottom: 6 }}>Phase (deg)</h4>
      <ChartContainer config={phaseConfig}>
        <ChartLegend config={phaseConfig} />
        <ResponsiveContainer height={250} width="100%">
          <LineChart data={points} margin={{ top: 8, right: 14, bottom: 8, left: 2 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis
              dataKey="logFreq"
              domain={[-1, 2]}
              tickFormatter={(value) => formatFrequencyTick(Number(value))}
              ticks={[-1, 0, 1, 2]}
              type="number"
            />
            <YAxis domain={[-200, 10]} />
            <RechartsTooltip
              content={<ChartTooltipContent config={phaseConfig} />}
            />
            <Line
              dataKey="phaseDeg"
              dot={false}
              isAnimationActive={false}
              stroke="var(--color-phaseDeg)"
              strokeWidth={2.4}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Gain setting</TableCell>
            <TableCell>{gainDb.toFixed(2)} dB</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gain crossover</TableCell>
            <TableCell>
              {crossover === null ? "none in plotted range" : `${formatNumber(crossover, 3)} rad/s`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Estimated phase margin</TableCell>
            <TableCell>{phaseMargin === null ? "N/A" : `${formatNumber(phaseMargin, 1)} deg`}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}
