import { useLayoutEffect, useRef } from 'react';

import { ProcessDiagram } from '@/components/ProcessDiagram';
import { paintProcessDiagram } from '@/motion/paintProcessDiagram';
import { useProcessOrientation } from '@/motion/useProcessOrientation';
import { ACT67 } from '@/scenes/06-firma/content';

function asSteps(labels: readonly string[]) {
  return labels.map((title, index) => ({ id: String(index), title }));
}

function fill(progress: number, count: number): number[] {
  return Array.from({ length: count }, () => progress);
}

function paint(root: HTMLElement | null, progress: number, count: number): void {
  if (!root) return;
  const amount = fill(progress, count);
  paintProcessDiagram(root, amount, amount);
}

export function IntermediationChain({
  conventional,
  optimvs,
  conventionalDraw,
  optimvsDraw,
}: {
  conventional: readonly string[];
  optimvs: readonly string[];
  conventionalDraw: number;
  optimvsDraw: number;
}) {
  const orientation = useProcessOrientation();
  const conventionalRef = useRef<HTMLDivElement>(null);
  const optimvsRef = useRef<HTMLDivElement>(null);
  const conventionalSteps = asSteps(conventional);
  const optimvsSteps = asSteps(optimvs);

  useLayoutEffect(() => {
    paint(conventionalRef.current, conventionalDraw, conventional.length);
    paint(optimvsRef.current, optimvsDraw, optimvs.length);
  }, [conventional, conventionalDraw, orientation, optimvs, optimvsDraw]);

  return (
    <div data-intermediation>
      <h3>{ACT67.copy.chainConventional}</h3>
      <div data-chain="conventional" ref={conventionalRef}>
        <ProcessDiagram
          drawProgress={fill(conventionalDraw, conventionalSteps.length)}
          orientation={orientation}
          stepGlow={fill(conventionalDraw, conventionalSteps.length)}
          steps={conventionalSteps}
        />
      </div>
      <h3>{ACT67.copy.chainOptimvs}</h3>
      <div data-chain="optimvs" ref={optimvsRef}>
        <ProcessDiagram
          drawProgress={fill(optimvsDraw, optimvsSteps.length)}
          orientation={orientation}
          stepGlow={fill(optimvsDraw, optimvsSteps.length)}
          steps={optimvsSteps}
        />
      </div>
    </div>
  );
}
