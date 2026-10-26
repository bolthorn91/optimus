import { useState } from 'react';

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
  const [openIndex, setOpenIndex] = useState(0);
  const currentIndex = activeIndex ?? openIndex;

  return (
    <ol className="process-step-list">
      {steps.map((step, index) => {
        const open = index === currentIndex;
        const content = (
          <StepCopy
            body={step.body}
            label={stepLabel}
            number={index + 1}
            open={open}
            title={step.title}
          />
        );

        return (
          <li data-process-step={step.id} key={step.id}>
            {onSelect ? (
              <button
                aria-pressed={open}
                onClick={() => {
                  onSelect(index);
                }}
                type="button"
              >
                {content}
              </button>
            ) : (
              <button
                aria-expanded={open}
                onClick={() => {
                  setOpenIndex(index);
                }}
                type="button"
              >
                {content}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepCopy({
  label,
  number,
  title,
  body,
  open,
}: {
  label: string;
  number: number;
  title: string;
  body: string;
  open: boolean;
}) {
  return (
    <>
      <span className="process-step-list__label">
        {label} {number}
      </span>
      <strong className="process-step-list__title">{title}</strong>
      <span className="process-step-list__body" hidden={!open}>
        {body}
      </span>
    </>
  );
}
