import type { ReactNode } from "react";

type DiagramCardProps = {
  caption?: string;
  viewBox: string;
  minWidth?: number;
  children: ReactNode;
};

type OpenLoopDiagramProps = {
  caption?: string;
  referenceLabel?: string;
  outputLabel?: string;
  blocks?: string[];
};

type ClosedLoopDiagramProps = {
  caption?: string;
  referenceLabel?: string;
  errorLabel?: string;
  controlLabel?: string;
  outputLabel?: string;
  sensorLabel?: string;
  disturbanceLabel?: string;
  forwardBlocks?: string[];
};

type ParallelConnectionDiagramProps = {
  caption?: string;
  inputLabel?: string;
  outputLabel?: string;
  upperBlockLabel?: string;
  lowerBlockLabel?: string;
};

type InputTestDiagramProps = {
  caption?: string;
  inputLabel?: string;
  outputLabel?: string;
  generatorLabel?: string;
  systemLabel?: string;
};

type LinearizationDiagramProps = {
  caption?: string;
  inputLabel?: string;
  outputLabel?: string;
};

function DiagramCard({
  caption,
  viewBox,
  minWidth = 760,
  children,
}: DiagramCardProps) {
  return (
    <figure
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 12,
        padding: 12,
        marginTop: 14,
        marginBottom: 18,
        background:
          "linear-gradient(180deg, rgba(248,250,252,0.85) 0%, rgba(255,255,255,0.95) 100%)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <svg
          aria-label={caption ?? "Control block diagram"}
          style={{
            display: "block",
            width: "100%",
            minWidth,
            height: "auto",
          }}
          viewBox={viewBox}
        >
          {children}
        </svg>
      </div>
      {caption ? (
        <figcaption
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#334155",
            fontWeight: 600,
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function MarkerDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        markerHeight="8"
        markerWidth="8"
        orient="auto"
        refX="7"
        refY="4"
      >
        <path d="M0,0 L8,4 L0,8 z" fill="#0f172a" />
      </marker>
    </defs>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  markerId,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  markerId: string;
  dashed?: boolean;
}) {
  return (
    <line
      markerEnd={`url(#${markerId})`}
      stroke="#0f172a"
      strokeDasharray={dashed ? "5 5" : undefined}
      strokeWidth="2.25"
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
    />
  );
}

function Block({
  x,
  y,
  width,
  height,
  label,
  fill = "#f8fafc",
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fill?: string;
}) {
  const lines = label.split("\n");
  const baseY = y + height / 2 - ((lines.length - 1) * 9) / 2;
  return (
    <g>
      <rect
        fill={fill}
        height={height}
        rx="10"
        stroke="#0f172a"
        strokeWidth="1.8"
        width={width}
        x={x}
        y={y}
      />
      <text
        fill="#0f172a"
        fontSize="14"
        fontWeight="600"
        textAnchor="middle"
        x={x + width / 2}
        y={baseY}
      >
        {lines.map((line, idx) => (
          <tspan dy={idx === 0 ? 0 : 16} key={`${label}-${line}-${idx}`} x={x + width / 2}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function SummingNode({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} fill="#ffffff" r="24" stroke="#0f172a" strokeWidth="1.8" />
      <text fill="#0f172a" fontSize="18" fontWeight="700" x={cx - 7} y={cy - 8}>
        +
      </text>
      <text fill="#0f172a" fontSize="18" fontWeight="700" x={cx - 5} y={cy + 18}>
        -
      </text>
    </g>
  );
}

export function OpenLoopDiagram({
  caption,
  referenceLabel = "r(t)",
  outputLabel = "y(t)",
  blocks = ["Controller", "Actuator", "Plant"],
}: OpenLoopDiagramProps) {
  const markerId = "arrow-open-loop";
  const centerY = 92;
  const blockY = 62;
  const blockWidth = 165;
  const blockHeight = 60;
  const spacing = 64;
  const firstBlockX = 210;
  const inputStartX = 60;
  const positions = blocks.map((_, idx) => firstBlockX + idx * (blockWidth + spacing));
  const lastBlockEndX = positions[positions.length - 1] + blockWidth;
  const outputX = lastBlockEndX + 110;

  return (
    <DiagramCard caption={caption} minWidth={920} viewBox="0 0 1120 190">
      <MarkerDefs id={markerId} />
      <Arrow
        markerId={markerId}
        x1={inputStartX}
        x2={positions[0]}
        y1={centerY}
        y2={centerY}
      />
      {positions.map((x, idx) => {
        const isLast = idx === positions.length - 1;
        return (
          <g key={`open-loop-${blocks[idx]}`}>
            <Block height={blockHeight} label={blocks[idx]} width={blockWidth} x={x} y={blockY} />
            {!isLast ? (
              <Arrow
                markerId={markerId}
                x1={x + blockWidth}
                x2={positions[idx + 1]}
                y1={centerY}
                y2={centerY}
              />
            ) : null}
          </g>
        );
      })}
      <Arrow markerId={markerId} x1={lastBlockEndX} x2={outputX} y1={centerY} y2={centerY} />
      <text fill="#0f172a" fontSize="15" fontWeight="600" x={inputStartX} y={centerY - 18}>
        {referenceLabel}
      </text>
      <text fill="#0f172a" fontSize="15" fontWeight="600" x={outputX + 10} y={centerY - 18}>
        {outputLabel}
      </text>
    </DiagramCard>
  );
}

export function ClosedLoopDiagram({
  caption,
  referenceLabel = "r(t)",
  errorLabel = "e(t)",
  controlLabel,
  outputLabel = "y(t)",
  sensorLabel = "Sensor H",
  disturbanceLabel,
  forwardBlocks = ["Controller C", "Actuator A", "Plant P"],
}: ClosedLoopDiagramProps) {
  const markerId = "arrow-closed-loop";
  const sumX = 160;
  const sumY = 100;
  const blockWidth = 170;
  const blockHeight = 60;
  const firstBlockX = 240;
  const spacing = 70;
  const blockY = 70;
  const centerY = sumY;
  const forwardXs = forwardBlocks.map((_, idx) => firstBlockX + idx * (blockWidth + spacing));
  const forwardEndX = forwardXs[forwardXs.length - 1] + blockWidth;
  const outputX = forwardEndX + 120;
  const feedbackY = 240;
  const sensorWidth = Math.min(260, Math.max(180, forwardEndX - firstBlockX - 70));
  const sensorHeight = 56;
  const sensorX = firstBlockX + (forwardEndX - firstBlockX - sensorWidth) / 2;
  const sensorY = feedbackY - sensorHeight / 2;

  return (
    <DiagramCard caption={caption} minWidth={980} viewBox="0 0 1160 320">
      <MarkerDefs id={markerId} />
      <SummingNode cx={sumX} cy={sumY} />

      <Arrow markerId={markerId} x1={66} x2={sumX - 24} y1={centerY} y2={centerY} />
      <Arrow
        markerId={markerId}
        x1={sumX + 24}
        x2={forwardXs[0]}
        y1={centerY}
        y2={centerY}
      />

      {forwardXs.map((x, idx) => {
        const isLast = idx === forwardXs.length - 1;
        return (
          <g key={`closed-loop-${forwardBlocks[idx]}`}>
            <Block
              fill={idx === forwardXs.length - 1 ? "#ecfeff" : "#f8fafc"}
              height={blockHeight}
              label={forwardBlocks[idx]}
              width={blockWidth}
              x={x}
              y={blockY}
            />
            {!isLast ? (
              <Arrow
                markerId={markerId}
                x1={x + blockWidth}
                x2={forwardXs[idx + 1]}
                y1={centerY}
                y2={centerY}
              />
            ) : null}
          </g>
        );
      })}

      <Arrow markerId={markerId} x1={forwardEndX} x2={outputX} y1={centerY} y2={centerY} />
      <Arrow markerId={markerId} x1={outputX} x2={outputX} y1={centerY} y2={feedbackY} />
      <Arrow
        markerId={markerId}
        x1={outputX}
        x2={sensorX + sensorWidth}
        y1={feedbackY}
        y2={feedbackY}
      />
      <Block
        fill="#f0fdf4"
        height={sensorHeight}
        label={sensorLabel}
        width={sensorWidth}
        x={sensorX}
        y={sensorY}
      />
      <Arrow markerId={markerId} x1={sensorX} x2={sumX} y1={feedbackY} y2={feedbackY} />
      <Arrow markerId={markerId} x1={sumX} x2={sumX} y1={feedbackY} y2={sumY + 24} />

      {disturbanceLabel ? (
        <g>
          <Arrow
            markerId={markerId}
            x1={forwardXs[forwardXs.length - 1] + blockWidth / 2}
            x2={forwardXs[forwardXs.length - 1] + blockWidth / 2}
            y1={28}
            y2={blockY}
          />
          <text
            fill="#0f172a"
            fontSize="14"
            fontWeight="600"
            x={forwardXs[forwardXs.length - 1] + blockWidth / 2 + 10}
            y={34}
          >
            {disturbanceLabel}
          </text>
        </g>
      ) : null}

      <text fill="#0f172a" fontSize="15" fontWeight="600" x={66} y={centerY - 18}>
        {referenceLabel}
      </text>
      <text
        fill="#0f172a"
        fontSize="15"
        fontWeight="600"
        x={(sumX + 24 + forwardXs[0]) / 2 - 10}
        y={centerY - 18}
      >
        {errorLabel}
      </text>
      {controlLabel && forwardXs.length > 1 ? (
        <text
          fill="#0f172a"
          fontSize="15"
          fontWeight="600"
          x={(forwardXs[0] + blockWidth + forwardXs[1]) / 2 - 10}
          y={centerY - 18}
        >
          {controlLabel}
        </text>
      ) : null}
      <text fill="#0f172a" fontSize="15" fontWeight="600" x={outputX + 10} y={centerY - 18}>
        {outputLabel}
      </text>
    </DiagramCard>
  );
}

export function ParallelConnectionDiagram({
  caption,
  inputLabel = "r",
  outputLabel = "y",
  upperBlockLabel = "G1(s)",
  lowerBlockLabel = "G2(s)",
}: ParallelConnectionDiagramProps) {
  const markerId = "arrow-parallel";
  const splitX = 190;
  const splitY = 155;
  const blockX = 320;
  const blockWidth = 180;
  const blockHeight = 58;
  const topY = 70;
  const bottomY = 190;
  const sumX = 760;
  const sumY = splitY;
  const outputX = 940;

  return (
    <DiagramCard caption={caption} minWidth={900} viewBox="0 0 1020 310">
      <MarkerDefs id={markerId} />
      <Arrow markerId={markerId} x1={70} x2={splitX} y1={splitY} y2={splitY} />
      <circle cx={splitX} cy={splitY} fill="#0f172a" r="4.5" />

      <line stroke="#0f172a" strokeWidth="2.25" x1={splitX} x2={splitX} y1={splitY} y2={99} />
      <Arrow markerId={markerId} x1={splitX} x2={blockX} y1={99} y2={99} />

      <line
        stroke="#0f172a"
        strokeWidth="2.25"
        x1={splitX}
        x2={splitX}
        y1={splitY}
        y2={bottomY + blockHeight / 2}
      />
      <Arrow
        markerId={markerId}
        x1={splitX}
        x2={blockX}
        y1={bottomY + blockHeight / 2}
        y2={bottomY + blockHeight / 2}
      />

      <Block height={blockHeight} label={upperBlockLabel} width={blockWidth} x={blockX} y={topY} />
      <Block
        height={blockHeight}
        label={lowerBlockLabel}
        width={blockWidth}
        x={blockX}
        y={bottomY}
      />

      <Arrow
        markerId={markerId}
        x1={blockX + blockWidth}
        x2={sumX}
        y1={topY + blockHeight / 2}
        y2={topY + blockHeight / 2}
      />
      <line
        stroke="#0f172a"
        strokeWidth="2.25"
        x1={sumX}
        x2={sumX}
        y1={topY + blockHeight / 2}
        y2={sumY}
      />

      <Arrow
        markerId={markerId}
        x1={blockX + blockWidth}
        x2={sumX}
        y1={bottomY + blockHeight / 2}
        y2={bottomY + blockHeight / 2}
      />
      <line
        stroke="#0f172a"
        strokeWidth="2.25"
        x1={sumX}
        x2={sumX}
        y1={bottomY + blockHeight / 2}
        y2={sumY}
      />

      <circle cx={sumX} cy={sumY} fill="#ffffff" r="22" stroke="#0f172a" strokeWidth="1.8" />
      <text fill="#0f172a" fontSize="18" fontWeight="700" x={sumX - 7} y={sumY + 6}>
        +
      </text>

      <Arrow markerId={markerId} x1={sumX + 22} x2={outputX} y1={sumY} y2={sumY} />

      <text fill="#0f172a" fontSize="15" fontWeight="600" x={70} y={splitY - 18}>
        {inputLabel}
      </text>
      <text fill="#0f172a" fontSize="15" fontWeight="600" x={outputX + 10} y={sumY - 18}>
        {outputLabel}
      </text>
    </DiagramCard>
  );
}

export function InputTestDiagram({
  caption,
  inputLabel = "r(t)",
  outputLabel = "y(t)",
  generatorLabel = "Input Generator\nstep(t), ramp(t), impulse(t)",
  systemLabel = "System Under Test",
}: InputTestDiagramProps) {
  const markerId = "arrow-test-input";
  const centerY = 102;
  const generatorX = 170;
  const generatorWidth = 250;
  const systemX = 540;
  const systemWidth = 250;
  const blockY = 72;
  const blockHeight = 60;

  return (
    <DiagramCard caption={caption} minWidth={860} viewBox="0 0 980 220">
      <MarkerDefs id={markerId} />
      <Block
        fill="#f0f9ff"
        height={blockHeight}
        label={generatorLabel}
        width={generatorWidth}
        x={generatorX}
        y={blockY}
      />
      <Block
        fill="#ecfeff"
        height={blockHeight}
        label={systemLabel}
        width={systemWidth}
        x={systemX}
        y={blockY}
      />

      <Arrow
        markerId={markerId}
        x1={generatorX + generatorWidth}
        x2={systemX}
        y1={centerY}
        y2={centerY}
      />
      <Arrow
        markerId={markerId}
        x1={systemX + systemWidth}
        x2={900}
        y1={centerY}
        y2={centerY}
      />

      <text
        fill="#0f172a"
        fontSize="15"
        fontWeight="600"
        x={(generatorX + generatorWidth + systemX) / 2 - 16}
        y={centerY - 18}
      >
        {inputLabel}
      </text>
      <text fill="#0f172a" fontSize="15" fontWeight="600" x={910} y={centerY - 18}>
        {outputLabel}
      </text>
    </DiagramCard>
  );
}

export function LinearizationDiagram({
  caption,
  inputLabel = "u(t)",
  outputLabel = "y(t)",
}: LinearizationDiagramProps) {
  const markerId = "arrow-linearization";
  const topY = 88;
  const plantX = 340;
  const plantWidth = 260;
  const plantHeight = 62;
  const centerY = topY + plantHeight / 2;
  const linearX = 305;
  const linearY = 210;
  const linearWidth = 330;
  const linearHeight = 62;

  return (
    <DiagramCard caption={caption} minWidth={900} viewBox="0 0 1020 320">
      <MarkerDefs id={markerId} />
      <Arrow markerId={markerId} x1={90} x2={plantX} y1={centerY} y2={centerY} />
      <Block
        fill="#ecfeff"
        height={plantHeight}
        label="Nonlinear Plant"
        width={plantWidth}
        x={plantX}
        y={topY}
      />
      <Arrow
        markerId={markerId}
        x1={plantX + plantWidth}
        x2={900}
        y1={centerY}
        y2={centerY}
      />

      <Arrow
        markerId={markerId}
        x1={plantX + plantWidth / 2}
        x2={plantX + plantWidth / 2}
        y1={topY + plantHeight}
        y2={linearY}
      />
      <Block
        fill="#f0fdf4"
        height={linearHeight}
        label="Local Linear Model  ΔG(s)"
        width={linearWidth}
        x={linearX}
        y={linearY}
      />

      <text fill="#0f172a" fontSize="15" fontWeight="600" x={90} y={centerY - 18}>
        {inputLabel}
      </text>
      <text fill="#0f172a" fontSize="15" fontWeight="600" x={910} y={centerY - 18}>
        {outputLabel}
      </text>
      <text fill="#0f172a" fontSize="14" fontWeight="600" x={370} y={196}>
        Operating point: (u0, x0, y0)
      </text>
      <text fill="#334155" fontSize="14" fontWeight="600" x={332} y={296}>
        Small-signal view:  Δy(t) ≈ ΔG(s)Δu(t)
      </text>
    </DiagramCard>
  );
}
