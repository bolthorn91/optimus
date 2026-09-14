import { ACT3 } from '@/scenes/03-asimetria-territorial/content';

export function TerritorialModelDiagram() {
  const titleId = 'act3-model-title';
  const descId = 'act3-model-desc';
  return (
    <svg
      aria-labelledby={`${titleId} ${descId}`}
      className="act3-model"
      role="img"
      viewBox="0 0 240 160"
    >
      <title id={titleId}>{ACT3.copy.modelTitle}</title>
      <desc id={descId}>{ACT3.copy.modelDesc}</desc>
      <circle cx="120" cy="80" fill="none" r="62" stroke="currentColor" strokeWidth="2" />
      <circle cx="120" cy="18" fill="currentColor" r="7" />
      <circle cx="174" cy="42" fill="currentColor" r="7" />
      <circle cx="182" cy="96" fill="currentColor" r="7" />
      <circle cx="148" cy="138" fill="currentColor" r="7" />
      <circle cx="92" cy="138" fill="currentColor" r="7" />
      <circle cx="58" cy="96" fill="currentColor" r="7" />
      <circle cx="66" cy="42" fill="currentColor" r="7" />
      <circle cx="120" cy="80" fill="currentColor" r="14" />
      <text fill="var(--ink)" fontSize="11" textAnchor="middle" x="120" y="110">
        {ACT3.copy.modelNode}
      </text>
    </svg>
  );
}
