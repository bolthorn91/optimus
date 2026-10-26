import { useRef, useState, type MouseEvent } from 'react';

import './process-diagram.css';

export interface ProcessDiagramStep {
  id: string;
  title: string;
  body?: string;
}

const ALONG_START = 90;
const ALONG_END = 910;
/** Radio del círculo del nodo. */
const NODE_RADIUS = 16;
/** Separación entre el borde del círculo y el final del trazo. */
const EDGE_GAP = 2;
/** Mitad del ancho de la tarjeta emergente; se usa para centrarla y limitarla. */
const TOOLTIP_HALF = 144;
/** Espacio vertical mínimo para colocar la tarjeta encima o debajo. */
const TOOLTIP_SAFE = 190;

interface Point {
  x: number;
  y: number;
}

interface TooltipState {
  index: number;
  left: number;
  top: number;
  placement: 'above' | 'below' | 'left' | 'right';
}

export function ProcessDiagram({
  steps,
  drawProgress,
  stepGlow,
  orientation,
  fromLabel,
  toLabel,
  stepLabel,
}: {
  steps: readonly ProcessDiagramStep[];
  drawProgress: readonly number[];
  stepGlow: readonly number[];
  orientation: 'horizontal' | 'vertical';
  fromLabel?: string;
  toLabel?: string;
  stepLabel?: string;
}) {
  const horizontal = orientation === 'horizontal';
  const viewBox = horizontal ? '0 0 1000 280' : '0 0 420 1000';
  const nodes = layout(steps.length, horizontal);
  const fromPoint = endpoint(horizontal, 'from');
  const toPoint = endpoint(horizontal, 'to');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const activeStep = tooltip ? steps[tooltip.index] : undefined;

  function showTooltip(index: number, event: MouseEvent<SVGGElement>): void {
    const circle = event.currentTarget.querySelector('.process-diagram__dot');
    const wrap = wrapRef.current;
    if (!circle || !wrap) return;

    const circleBox = circle.getBoundingClientRect();
    const wrapBox = wrap.getBoundingClientRect();
    const x = circleBox.left - wrapBox.left + circleBox.width / 2;
    const y = circleBox.top - wrapBox.top + circleBox.height / 2;
    const half = Math.min(TOOLTIP_HALF, wrapBox.width / 2);
    const cardWidth = Math.min(TOOLTIP_HALF * 2, window.innerWidth - 32);
    const radius = circleBox.width / 2;
    const nearTop = circleBox.top < 100;
    const nearBottom = window.innerHeight - circleBox.bottom < 100;
    const rightSpace = window.innerWidth - circleBox.right;
    const leftSpace = circleBox.left;

    let placement: TooltipState['placement'];
    let left: number;
    let top: number;

    if (!horizontal && !nearTop && !nearBottom && rightSpace >= cardWidth + 20) {
      placement = 'right';
      left = x + radius + 14;
      top = y;
    } else if (!horizontal && !nearTop && !nearBottom && leftSpace >= cardWidth + 20) {
      placement = 'left';
      left = x - radius - 14;
      top = y;
    } else {
      const spaceAbove = circleBox.top;
      const spaceBelow = window.innerHeight - circleBox.bottom;
      const below = nearTop || (spaceAbove < TOOLTIP_SAFE && spaceBelow > spaceAbove);
      placement = below ? 'below' : 'above';
      left = Math.min(Math.max(x, half), Math.max(half, wrapBox.width - half));
      top = below ? y + radius + 14 : y - radius - 14;
    }

    setTooltip({ index, left, top, placement });
  }

  return (
    <div
      className="process-diagram-wrap"
      onMouseLeave={() => {
        setTooltip(null);
      }}
      ref={wrapRef}
    >
      <svg
        aria-hidden="true"
        className="process-diagram"
        data-draw={drawProgress.join(' ')}
        data-glow={stepGlow.join(' ')}
        data-orientation={orientation}
        data-process-diagram
        preserveAspectRatio="xMidYMin meet"
        viewBox={viewBox}
      >
        {fromLabel ? (
          <text
            className="process-diagram__end"
            textAnchor="middle"
            x={fromPoint.x}
            y={fromPoint.labelY}
          >
            {fromLabel}
          </text>
        ) : null}
        {toLabel ? (
          <text
            className="process-diagram__end"
            textAnchor="middle"
            x={toPoint.x}
            y={toPoint.labelY}
          >
            {toLabel}
          </text>
        ) : null}
        {nodes.map((node, index) => {
          const previous = index === 0 ? (fromLabel ? fromPoint : null) : nodes[index - 1];
          const lines = wrapTitle(steps[index]?.title ?? '', horizontal ? 20 : 24);
          const titleX = horizontal ? node.x : node.x + 36;
          const titleY = horizontal ? node.y + 38 : node.y - 8;
          return (
            <g key={steps[index]?.id ?? String(index)}>
              {previous ? (
                <path
                  d={connector(previous, node, index > 0)}
                  data-process-stroke={String(index)}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              ) : null}
              <g
                data-process-node={String(index)}
                onClick={(event) => {
                  showTooltip(index, event);
                }}
                onMouseEnter={(event) => {
                  showTooltip(index, event);
                }}
              >
                <circle
                  className="process-diagram__hit"
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS + 14}
                />
                <circle className="process-diagram__dot" cx={node.x} cy={node.y} r={NODE_RADIUS} />
                <text textAnchor="middle" x={node.x} y={node.y + 5}>
                  {String(index + 1)}
                </text>
              </g>
              <text
                className="process-diagram__label"
                textAnchor={horizontal ? 'middle' : 'start'}
                x={titleX}
                y={titleY}
              >
                {lines.map((line, lineIndex) => (
                  <tspan dy={lineIndex === 0 ? 0 : 14} key={lineIndex} x={titleX}>
                    {lineIndex === 0 ? line : ` ${line}`}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
      {activeStep ? (
        <div
          className="process-diagram__tooltip"
          data-placement={tooltip?.placement ?? 'above'}
          data-process-tooltip
          role="tooltip"
          style={{
            left: `${String(tooltip?.left ?? 0)}px`,
            top: `${String(tooltip?.top ?? 0)}px`,
          }}
        >
          <span className="process-diagram__tooltip-label">
            {stepLabel
              ? `${stepLabel} ${String((tooltip?.index ?? 0) + 1)}`
              : `Paso ${String((tooltip?.index ?? 0) + 1)}`}
          </span>
          <strong className="process-diagram__tooltip-title">{activeStep.title}</strong>
          {activeStep.body ? (
            <span className="process-diagram__tooltip-body">{activeStep.body}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function layout(count: number, horizontal: boolean): Point[] {
  if (count <= 0) return [];
  const mid = horizontal ? 130 : 140;
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const along = ALONG_START + t * (ALONG_END - ALONG_START);
    return horizontal ? { x: along, y: mid } : { x: mid, y: along };
  });
}

function endpoint(
  horizontal: boolean,
  which: 'from' | 'to',
): { x: number; y: number; labelY: number } {
  const mid = horizontal ? 130 : 140;
  if (horizontal) {
    const x = which === 'from' ? 48 : 952;
    return { x, y: mid, labelY: 56 };
  }
  const y = which === 'from' ? 36 : 980;
  return { x: mid, y, labelY: y };
}

/**
 * La línea se recorta en el borde del círculo. Sin este recorte el trazo llega al
 * centro y, como el relleno del nodo es translúcido, se ve cruzar el punto.
 */
function connector(from: Point, to: Point, shortenStart: boolean): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return '';

  const offset = NODE_RADIUS + EDGE_GAP;
  const ux = dx / length;
  const uy = dy / length;
  const start = shortenStart
    ? { x: from.x + ux * offset, y: from.y + uy * offset }
    : { x: from.x, y: from.y };
  const end = { x: to.x - ux * offset, y: to.y - uy * offset };

  return `M ${String(start.x)} ${String(start.y)} L ${String(end.x)} ${String(end.y)}`;
}

function wrapTitle(title: string, max: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of title.split(' ')) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}
