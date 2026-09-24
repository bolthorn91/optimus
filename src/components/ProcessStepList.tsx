import type { ProcessDiagramStep } from '@/components/ProcessDiagram';

import './process-diagram.css';

export type ProcessStepListItem = ProcessDiagramStep & { body: string };

export function ProcessStepList({
  steps,
  stepLabel,
  activeIndex,
  onSelect,
}: {
  steps: readonly ProcessStepListItem[];
  stepLabel: string;
  activeIndex?: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <ol className="process-step-list">
      {steps.map((step, index) => (
        <li data-process-step={step.id} key={step.id}>
          {onSelect ? (
            <button
              aria-pressed={index === activeIndex}
              onClick={() => {
                onSelect(index);
              }}
              type="button"
            >
              <StepCopy body={step.body} label={stepLabel} number={index + 1} title={step.title} />
            </button>
          ) : (
            <StepCopy body={step.body} label={stepLabel} number={index + 1} title={step.title} />
          )}
        </li>
      ))}
    </ol>
  );
}

function StepCopy({
  label,
  number,
  title,
  body,
}: {
  label: string;
  number: number;
  title: string;
  body: string;
}) {
  return (
    <>
      <span>
        {label} {number}
      </span>
      <strong>{title}</strong>
      <span className="process-step-list__body">{body}</span>
    </>
  );
}
