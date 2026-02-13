import type { ReactNode } from "react";

type NodeProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: ReactNode;
  fill?: string;
};

function Node({ x, y, w, h, label, fill = "#f8fafc" }: NodeProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        fill={fill}
        stroke="#0f172a"
        strokeWidth="1.7"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 5}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#0f172a"
      >
        {label}
      </text>
    </g>
  );
}

function Branch({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="1.8" />;
}

export function ControlSystemsTree() {
  return (
    <figure
      style={{
        border: "1px solid #dbe2ea",
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        marginBottom: 18,
        background:
          "linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(255,255,255,0.98) 100%)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <svg viewBox="0 0 1080 530" style={{ width: "100%", minWidth: 960, height: "auto" }}>
          <Node x={430} y={20} w={220} h={56} fill="#e0f2fe" label="Control Systems" />

          <Branch x1={540} y1={76} x2={220} y2={130} />
          <Branch x1={540} y1={76} x2={540} y2={130} />
          <Branch x1={540} y1={76} x2={860} y2={130} />

          <Node x={120} y={130} w={200} h={54} fill="#ecfeff" label="Classical Control" />
          <Node x={440} y={130} w={200} h={54} fill="#ecfeff" label="Modern Control" />
          <Node x={760} y={130} w={200} h={54} fill="#ecfeff" label="Implementation" />

          <Branch x1={220} y1={184} x2={110} y2={250} />
          <Branch x1={220} y1={184} x2={220} y2={250} />
          <Branch x1={220} y1={184} x2={330} y2={250} />

          <Node x={30} y={250} w={160} h={50} label="Transfer Function" />
          <Node x={140} y={250} w={160} h={50} label="Time-Domain" />
          <Node x={250} y={250} w={160} h={50} label="Frequency-Domain" />

          <Branch x1={540} y1={184} x2={430} y2={250} />
          <Branch x1={540} y1={184} x2={540} y2={250} />
          <Branch x1={540} y1={184} x2={650} y2={250} />

          <Node x={350} y={250} w={160} h={50} label="State-Space" />
          <Node x={460} y={250} w={160} h={50} label="System Properties" />
          <Node x={570} y={250} w={160} h={50} label="Optimal Control" />

          <Branch x1={860} y1={184} x2={750} y2={250} />
          <Branch x1={860} y1={184} x2={860} y2={250} />
          <Branch x1={860} y1={184} x2={970} y2={250} />

          <Node x={670} y={250} w={160} h={50} label="Digital Control" />
          <Node x={780} y={250} w={160} h={50} label="Sampled-Data" />
          <Node x={890} y={250} w={160} h={50} label="Real Systems Lab" />

          <Branch x1={110} y1={300} x2={110} y2={364} />
          <Node x={20} y={364} w={180} h={46} label="Modeling and ODEs" />

          <Branch x1={220} y1={300} x2={220} y2={364} />
          <Node x={130} y={364} w={180} h={46} label="Step + SSE" />

          <Branch x1={330} y1={300} x2={330} y2={364} />
          <Node x={240} y={364} w={180} h={46} label="Bode / Nyquist" />

          <Branch x1={430} y1={300} x2={430} y2={364} />
          <Node x={340} y={364} w={180} h={46} label="A, B, C, D Models" />

          <Branch x1={540} y1={300} x2={540} y2={364} />
          <Node x={450} y={364} w={180} h={46} label="Controllability / Observability" />

          <Branch x1={650} y1={300} x2={650} y2={364} />
          <Node x={560} y={364} w={180} h={46} label="LQR / MPC" />

          <Branch x1={750} y1={300} x2={750} y2={364} />
          <Node x={660} y={364} w={180} h={46} label="Difference Equations" />

          <Branch x1={860} y1={300} x2={860} y2={364} />
          <Node x={770} y={364} w={180} h={46} label="Sampling + ZOH" />

          <Branch x1={970} y1={300} x2={970} y2={364} />
          <Node x={880} y={364} w={180} h={46} label="Inverted Pendulum" />
        </svg>
      </div>
      <figcaption
        style={{
          marginTop: 8,
          fontSize: 13,
          color: "#334155",
          fontWeight: 600,
        }}
      >
        Control-systems learning tree used in this course roadmap.
      </figcaption>
    </figure>
  );
}
