"use client";

import { cn } from "@/lib/utils";
import type { ScoreBreakdownItem } from "@/types";

type Props = {
  items: ScoreBreakdownItem[];
  className?: string;
};

/** Short multi-line radar labels so long names (e.g. Recommendation Letters) fit */
const LABEL_LINES: Record<string, string[]> = {
  leadership: ["Leadership"],
  innovation: ["Innovation"],
  impact: ["Impact"],
  recognition: ["Recognition"],
  publicProfile: ["Public", "Profile"],
  evidence: ["Evidence"],
  recommendationLetters: ["Recommend.", "Letters"],
  futurePlans: ["Future", "Plans"],
};

function labelLines(item: ScoreBreakdownItem): string[] {
  return (
    LABEL_LINES[item.id] ??
    (item.label.includes(" ")
      ? item.label.split(/\s+/).slice(0, 2)
      : [item.label])
  );
}

/** Simple SVG radar — GitHub Insights style */
export function AssessmentRadar({ items, className }: Props) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 100;
  const levels = [0.25, 0.5, 0.75, 1];
  const n = items.length;

  function point(i: number, value: number) {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return {
      x: cx + Math.cos(angle) * radius * value,
      y: cy + Math.sin(angle) * radius * value,
    };
  }

  const gridPolygons = levels.map((level) =>
    items
      .map((_, i) => {
        const p = point(i, level);
        return `${p.x},${p.y}`;
      })
      .join(" ")
  );

  const dataPolygon = items
    .map((item, i) => {
      const p = point(i, item.score / 100);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className={cn("flex items-center justify-center overflow-visible", className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full max-w-[340px] overflow-visible"
        role="img"
        aria-label="Assessment radar chart"
      >
        {gridPolygons.map((points) => (
          <polygon
            key={points}
            points={points}
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth="1"
          />
        ))}
        {items.map((_, i) => {
          const p = point(i, 1);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={dataPolygon}
          fill="oklch(0.454 0.310 265.4 / 0.18)"
          stroke="oklch(0.454 0.310 265.4)"
          strokeWidth="2"
        />
        {items.map((item, i) => {
          const p = point(i, item.score / 100);
          return (
            <circle
              key={item.id}
              cx={p.x}
              cy={p.y}
              r="3.5"
              className="fill-primary"
            />
          );
        })}
        {items.map((item, i) => {
          const lines = labelLines(item);
          const labelR = radius + 36;
          const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
          const x = cx + Math.cos(angle) * labelR;
          const y = cy + Math.sin(angle) * labelR;
          const lineH = 11;
          const startY = y - ((lines.length - 1) * lineH) / 2;

          return (
            <text
              key={`label-${item.id}`}
              x={x}
              y={startY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              fontSize="10"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {lines.map((line, li) => (
                <tspan key={line} x={x} dy={li === 0 ? 0 : lineH}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
