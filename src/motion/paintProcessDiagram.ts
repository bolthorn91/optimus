import { gsap } from '@/motion/gsapSetup';

/** Aplica DrawSVG y la iluminación de nodos. Vive aquí para no importar gsap desde components/. */
export function paintProcessDiagram(
  root: Element,
  drawProgress: readonly number[],
  stepGlow: readonly number[],
): () => void {
  const ctx = gsap.context(() => {
    root.querySelectorAll<SVGPathElement>('[data-process-stroke]').forEach((path) => {
      const index = Number(path.dataset.processStroke);
      const progress = drawProgress[index] ?? 0;
      gsap.set(path, { drawSVG: `${String(progress * 100)}%` });
    });
    root.querySelectorAll<SVGGElement>('[data-process-node]').forEach((node) => {
      const index = Number(node.dataset.processNode);
      const glow = stepGlow[index] ?? 0;
      gsap.set(node, { opacity: 0.28 + glow * 0.72 });
      node.style.setProperty('--step-glow', String(glow));
    });
  }, root);

  return () => {
    ctx.revert();
  };
}
