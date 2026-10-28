"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import { mediaQueries } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/utils";

import { onScrollFrame, scrollProgress } from "../lib/scroll";
import {
  bollards,
  BUILDING,
  cameras,
  CONTROL_POINT,
  CONTROL_ROOM,
  coverageDescription,
  coverageLayers,
  GATE,
  GATEHOUSE,
  PARKING,
  ptz,
  readers,
  sector,
  SITE,
  zones,
  type CoverageLayer,
} from "../model/coverage";

const LABEL = "font-mono uppercase";
// Below 640 px the 960-unit plan renders at about a third of its size: strokes keep their screen width
// (non-scaling) and device markers grow, so lines, dashes and devices stay legible on phones.
const CRISP = { vectorEffect: "non-scaling-stroke" } as const;
const MARKER = "origin-center [transform-box:fill-box] max-sm:scale-[1.8]";

// Scroll-linked reveal without GSAP: the figure carries `--p` (0–1; unset means 1, the finished
// plan). Each element turns it into its own eased progress `--k` over [--at, --at + --span] and
// animates opacity and transform only; the short transition smooths the per-frame steps.
const STEP =
  "[--t:clamp(0,calc((var(--p,1)_-_var(--at))/var(--span)),1)] [--k:calc(var(--t)*var(--t)*(3_-_2*var(--t)))] transition-[opacity,transform] duration-300 ease-out";
const FADE = `${STEP} [opacity:var(--k)]`;
const SWEEP = `${STEP} [opacity:var(--k)] [transform-box:view-box] [transform:rotate(calc((1_-_var(--k))*-24deg))_scale(calc(0.2_+_0.8*var(--k)))]`;
const POP = `${STEP} [opacity:var(--k)] [transform-box:fill-box] origin-center [transform:scale(calc(0.4_+_0.6*var(--k)))]`;
const at = (start: number, span: number, origin?: { x: number; y: number }) =>
  ({ "--at": start, "--span": span, transformOrigin: origin && `${origin.x}px ${origin.y}px` }) as CSSProperties;

/** Legend swatch drawn with the same marks as the plan. */
function Swatch({ layer }: { layer: CoverageLayer }) {
  return (
    <svg aria-hidden viewBox="0 0 40 24" className="h-6 w-10 shrink-0 overflow-visible">
      {layer === "cameras" && (
        <>
          <path d={sector(4, 12, 0, 60, 34)} className="fill-highlight/20 stroke-highlight/70" strokeWidth={1} />
          <circle cx={4} cy={12} r={3.5} className="fill-surface stroke-highlight" strokeWidth={1.5} />
        </>
      )}
      {layer === "perimeter" && (
        <>
          <path d="M2 12 H38" className="stroke-highlight/30" strokeWidth={8} />
          <path d="M2 12 H38" className="stroke-highlight" strokeWidth={1.5} strokeDasharray="4 3" />
        </>
      )}
      {layer === "access" && <rect x={14} y={6} width={12} height={12} rx={2} className="fill-accent stroke-accent-text" strokeWidth={1.5} />}
      {layer === "links" && <path d="M2 12 H38" className="stroke-accent-text" strokeWidth={1.5} strokeDasharray="3 4" />}
    </svg>
  );
}

/**
 * Interactive security coverage plan (planning/DESIGN.md §9.2): SVG, no 3D. The finished plan is
 * prerendered; when it is scrolled into view, the perimeter zones fill, the cameras sweep open their
 * fields of view, the access points appear and the monitoring links connect. The legend toggles
 * each layer (aria-pressed) and hovering or focusing an entry emphasises it. Reduced motion shows
 * the finished plan with no movement.
 */
export function CoverageDiagram({ caption }: { caption: string }) {
  const id = useId();
  const [hidden, setHidden] = useState<Partial<Record<CoverageLayer, boolean>>>({});
  const [emphasis, setEmphasis] = useState<CoverageLayer | null>(null);

  const figureRef = useRef<HTMLElement>(null);

  // Progress runs from the plan's top at 80 % of the viewport to its centre at 45 %.
  useEffect(() => {
    const figure = figureRef.current;
    const plan = figure?.querySelector("svg");
    const reduced = window.matchMedia(mediaQueries.reduced);
    if (!figure || !plan || reduced.matches) return;
    // Already on screen when the page opened: keep the finished plan instead of hiding parts of it.
    if (plan.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    const stop = onScrollFrame(() => {
      if (reduced.matches) figure.style.removeProperty("--p");
      else figure.style.setProperty("--p", scrollProgress(plan.getBoundingClientRect(), window.innerHeight, 0.8, 0.45, 0.5).toFixed(3));
    }, [reduced]);
    return () => {
      stop();
      figure.style.removeProperty("--p");
    };
  }, []);

  const layerClass = (layer: CoverageLayer) =>
    cn(
      "transition-opacity duration-250 ease-standard",
      hidden[layer] ? "opacity-0" : emphasis && emphasis !== layer ? "opacity-25" : "opacity-100",
    );

  return (
    <figure ref={figureRef} className="mt-12 lg:mt-16">
      <div className="relative overflow-hidden rounded-md border border-line bg-surface-muted">
        <svg
          viewBox="0 0 960 640"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          className="block h-auto w-full"
        >
          <title id={`${id}-title`}>Illustrative security coverage plan</title>
          <desc id={`${id}-desc`}>{coverageDescription}</desc>
          <defs>
            <pattern id={`${id}-grid`} width={40} height={40} patternUnits="userSpaceOnUse">
              <path d="M40 0 H0 V40" fill="none" className="stroke-line" strokeWidth={1} />
            </pattern>
            {cameras.map((camera) => (
              <radialGradient
                key={camera.id}
                id={`${id}-${camera.id.replace(" ", "")}`}
                gradientUnits="userSpaceOnUse"
                cx={camera.x}
                cy={camera.y}
                r={camera.range}
              >
                <stop offset="0" style={{ stopColor: "var(--highlight)", stopOpacity: 0.32 }} />
                <stop offset="1" style={{ stopColor: "var(--highlight)", stopOpacity: 0.04 }} />
              </radialGradient>
            ))}
          </defs>

          {/* Base plan: grid, fence, building, parking, gate. Always visible. */}
          <rect width={960} height={640} fill={`url(#${id}-grid)`} />
          <path
            d={`M${GATE.from} ${SITE.y + SITE.height} H${SITE.x} V${SITE.y} H${SITE.x + SITE.width} V${SITE.y + SITE.height} H${GATE.to}`}
            fill="none"
            className="stroke-line-strong"
            strokeWidth={2}
            {...CRISP}
          />
          <g className="stroke-line-strong" strokeWidth={1.5}>
            {Array.from({ length: Math.floor(PARKING.width / PARKING.stall) + 1 }, (_, i) => (
              <path
                key={i}
                d={`M${PARKING.x + i * PARKING.stall} ${PARKING.y} v48 M${PARKING.x + i * PARKING.stall} ${PARKING.y + PARKING.height} v-48`}
                {...CRISP}
              />
            ))}
          </g>
          <rect {...BUILDING} rx={3} className="fill-surface-raised stroke-line-strong" strokeWidth={1.5} {...CRISP} />
          <rect {...GATEHOUSE} rx={2} className="fill-surface-raised stroke-line-strong" strokeWidth={1.5} {...CRISP} />
          <path d={`M${GATE.from + 6} ${SITE.y + SITE.height} H${GATE.to - 34}`} className="stroke-ink-subtle" strokeWidth={3} strokeLinecap="round" />
          <g className={cn(LABEL, "fill-ink-subtle max-sm:hidden")} fontSize={13} letterSpacing={1.8}>
            <text x={BUILDING.x + BUILDING.width - 16} y={BUILDING.y + BUILDING.height - 18} textAnchor="end">
              Main building
            </text>
            <text x={PARKING.x} y={PARKING.y - 14}>
              Parking
            </text>
            <text x={(GATE.from + GATE.to) / 2} y={SITE.y + SITE.height + 30} textAnchor="middle">
              Vehicle gate
            </text>
            <text x={GATEHOUSE.x + GATEHOUSE.width + 10} y={GATEHOUSE.y + 22}>
              Gatehouse
            </text>
            <text x={60} y={624} fontSize={11}>
              Not to scale
            </text>
          </g>
          <g aria-hidden className="fill-ink-subtle">
            <path d="M926 586 l8 22 l-8 -6 l-8 6 z" />
            <text x={926} y={580} textAnchor="middle" fontSize={12} className={LABEL}>
              N
            </text>
          </g>

          {/* Monitoring links, drawn under the devices. */}
          <g className={layerClass("links")}>
            <rect {...CONTROL_ROOM} rx={2} className={cn(FADE, "fill-accent/20 stroke-accent-text")} style={at(0.72, 0.12)} strokeWidth={1.5} />
            <g className="stroke-accent-text/70" strokeWidth={1.25} strokeDasharray="3 5" fill="none">
              {[...cameras, ptz, ...readers].map((device, index) => (
                <path
                  key={device.id}
                  d={`M${device.x} ${device.y} L${CONTROL_POINT.x} ${CONTROL_POINT.y}`}
                  className={FADE}
                  style={at(0.735 + index * 0.012, 0.12)}
                  {...CRISP}
                />
              ))}
            </g>
            <text
              x={CONTROL_ROOM.x + 8}
              y={CONTROL_ROOM.y + CONTROL_ROOM.height + 18}
              fontSize={13}
              letterSpacing={1.8}
              className={cn(LABEL, "fill-accent-text max-sm:hidden")}
            >
              Control room
            </text>
          </g>

          <g className={layerClass("perimeter")}>
            {zones.map((zone, index) => (
              <g key={zone.id} className={FADE} style={at(index * 0.06, 0.15)}>
                <path d={zone.d} fill="none" className="stroke-highlight/25" strokeWidth={12} />
                <path d={zone.d} fill="none" className="stroke-highlight" strokeWidth={1.5} strokeDasharray="6 5" {...CRISP} />
                <text
                  x={zone.label.x}
                  y={zone.label.y}
                  textAnchor="middle"
                  fontSize={12}
                  letterSpacing={1.6}
                  transform={zone.id === "Zone 2" || zone.id === "Zone 5" ? `rotate(-90 ${zone.label.x} ${zone.label.y})` : undefined}
                  className={cn(LABEL, "fill-highlight max-sm:hidden")}
                >
                  {zone.id}
                </text>
              </g>
            ))}
          </g>

          <g className={layerClass("cameras")}>
            {cameras.map((camera, index) => (
              <path
                key={camera.id}
                d={sector(camera.x, camera.y, camera.angle, camera.fov, camera.range)}
                fill={`url(#${id}-${camera.id.replace(" ", "")})`}
                className={cn(SWEEP, "stroke-highlight/60")}
                style={at(0.2 + index * 0.06, 0.22, camera)}
                strokeWidth={1}
                {...CRISP}
              />
            ))}
            <circle
              cx={ptz.x}
              cy={ptz.y}
              r={ptz.range}
              className={cn(SWEEP, "fill-highlight/8 stroke-highlight/60")}
              style={at(0.2 + cameras.length * 0.06, 0.22, ptz)}
              strokeWidth={1}
              strokeDasharray="4 4"
              {...CRISP}
            />
            {cameras.map((camera) => (
              <g key={camera.id} className={MARKER}>
                <circle cx={camera.x} cy={camera.y} r={7} className="fill-surface stroke-highlight" strokeWidth={2} />
                <circle cx={camera.x} cy={camera.y} r={2.5} className="fill-highlight" />
              </g>
            ))}
            <g className={MARKER}>
              <circle cx={ptz.x} cy={ptz.y} r={9} className="fill-surface stroke-highlight" strokeWidth={2} />
              <circle cx={ptz.x} cy={ptz.y} r={4} className="fill-highlight" />
            </g>
            <g className={cn(LABEL, "fill-highlight max-sm:hidden")} fontSize={11} letterSpacing={1.4}>
              {cameras.map((camera) => (
                <text
                  key={camera.id}
                  x={camera.x + (camera.x > 480 ? -14 : 14)}
                  y={camera.y + (camera.y > 320 ? 24 : -14)}
                  textAnchor={camera.x > 480 ? "end" : "start"}
                >
                  {camera.id}
                </text>
              ))}
              <text x={ptz.x + 14} y={ptz.y - 12}>
                {ptz.id}
              </text>
            </g>
          </g>

          <g className={layerClass("access")}>
            {bollards.map((x, index) => (
              <circle
                key={x}
                cx={x}
                cy={SITE.y + SITE.height - 16}
                r={6}
                className={cn(POP, MARKER, "fill-accent stroke-accent-text")}
                style={at(0.62 + index * 0.03, 0.12)}
                strokeWidth={1.5}
              />
            ))}
            {readers.map((reader, index) => (
              <g key={reader.id} className={cn(POP, MARKER)} style={at(0.71 + index * 0.03, 0.12)}>
                <rect x={reader.x - 7} y={reader.y - 7} width={14} height={14} rx={2} className="fill-accent stroke-accent-text" strokeWidth={1.5} />
                <text
                  x={reader.x + 14}
                  y={reader.y + 4}
                  fontSize={11}
                  letterSpacing={1.4}
                  className={cn(LABEL, "fill-accent-text max-sm:hidden")}
                >
                  {reader.id}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Diagram layers">
        {coverageLayers.map((layer) => {
          const shown = !hidden[layer.id];
          return (
            <li key={layer.id}>
              <button
                type="button"
                aria-pressed={shown}
                onClick={() => setHidden((current) => ({ ...current, [layer.id]: shown }))}
                onPointerEnter={(event) => event.pointerType === "mouse" && setEmphasis(layer.id)}
                onPointerLeave={() => setEmphasis(null)}
                onFocus={() => setEmphasis(layer.id)}
                onBlur={() => setEmphasis(null)}
                className={cn(
                  "flex min-h-11 w-full items-start gap-4 rounded-sm border p-4 text-start transition-colors duration-150",
                  shown ? "border-line-strong bg-surface-raised" : "border-line bg-transparent",
                  "hover:border-ink-subtle",
                )}
              >
                <span className={cn("mt-0.5 transition-opacity duration-150", !shown && "opacity-40")}>
                  <Swatch layer={layer.id} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-display text-body font-semibold text-ink">
                    {layer.title}
                    <span aria-hidden className="type-label text-ink-subtle">
                      {shown ? "On" : "Off"}
                    </span>
                  </span>
                  <span className="text-body-sm text-ink-muted">{layer.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-4 text-body-sm text-ink-subtle">{caption}</figcaption>
    </figure>
  );
}
