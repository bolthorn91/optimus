import './process-diagram.css';

export interface ProcessDiagramStep {
  id: string;
  title: string;
  body?: string;
}

const ALONG_START = 90;
const ALONG_END = 910;

export function ProcessDiagram({
  steps,
  drawProgress,
  stepGlow,
  orientation,
  fromLabel,
  toLabel,
}: {
  steps: readonly ProcessDiagramStep[];
  drawProgress: readonly number[];
  stepGlow: readonly number[];
  orientation: 'horizontal' | 'vertical';
  fromLabel?: string;
  toLabel?: string;
}) {
  const horizontal = orientation === 'horizontal';
  const viewBox = horizontal ? '0 0 1000 280' : '0 0 420 1000';
  const nodes = layout(steps.length, horizontal);
  const fromPoint = endpoint(horizontal, 'from');
  const toPoint = endpoint(horizontal, 'to');

  return (
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
        <text className="process-diagram__end" textAnchor="middle" x={toPoint.x} y={toPoint.labelY}>
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
                d={`M ${previous.x} ${previous.y} L ${node.x} ${node.y}`}
                data-process-stroke={String(index)}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            ) : null}
            <g data-process-node={String(index)}>
              <circle cx={node.x} cy={node.y} r="16" />
              <text textAnchor="middle" x={node.x} y={node.y + 5}>
                {String(index + 1)}
              </text>
            </g>
            <text textAnchor={horizontal ? 'middle' : 'start'} x={titleX} y={titleY}>
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
  );
}

function layout(count: number, horizontal: boolean): { x: number; y: number }[] {
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
