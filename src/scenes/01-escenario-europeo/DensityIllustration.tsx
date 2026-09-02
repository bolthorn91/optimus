import { useLayoutEffect, useRef } from 'react';

import { clamp01 } from '@/lib/interpolate';
import { PALETTE } from '@/lib/tokens';

const COLS = 18;
const ROWS = 12;
const POINTS = COLS * ROWS;

function draw(canvas: HTMLCanvasElement, progress: number): void {
  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext('2d');
  } catch {
    return;
  }
  if (!ctx) return;
  const { width, height } = canvas;
  const p = clamp01(progress);
  ctx.clearRect(0, 0, width, height);
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = PALETTE.goldHigh;
  for (let i = 0; i < POINTS; i += 1) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const ux = (col + 0.5) / COLS;
    const uy = (row + 0.5) / ROWS;
    const clusterX = 0.62 + (i % 5) * 0.02;
    const clusterY = 0.38 + (row % 4) * 0.03;
    const x = (ux + (clusterX - ux) * p) * width;
    const y = (uy + (clusterY - uy) * p) * height;
    ctx.beginPath();
    ctx.arc(x, y, 1.6 + p, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function DensityIllustration({ progress }: { progress: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.width = 320;
    canvas.height = 200;
    draw(canvas, progress);
  }, [progress]);

  return <canvas aria-hidden="true" data-density-illustration ref={ref} />;
}
