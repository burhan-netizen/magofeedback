import React from 'react';
import { FormStep } from '../types';

interface ProgressIndicatorProps {
  currentStep: FormStep;
  highestStepReached: FormStep;
  onStepClick: (step: FormStep) => void;
}

const STEPS: Array<{ n: FormStep; label: string }> = [
  { n: 1, label: 'About you' },
  { n: 2, label: 'Rating' },
  { n: 3, label: 'In your words' },
  { n: 4, label: 'Testimonial' },
  { n: 5, label: 'Referrals' },
  { n: 6, label: 'Review' },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, highestStepReached, onStepClick }) => (
  <nav aria-label="Progress" className="mb-6">
    <div className="flex items-baseline justify-between mb-3">
      <p className="ml-eyebrow text-ink">{STEPS[currentStep - 1].label}</p>
      <p className="ml-eyebrow">
        {String(currentStep).padStart(2, '0')} / 06
      </p>
    </div>
    <ol className="grid grid-cols-6 gap-1.5">
      {STEPS.map((s) => {
        const reachable = s.n <= highestStepReached;
        const state = s.n === currentStep ? 'current' : s.n < currentStep ? 'done' : reachable ? 'reached' : 'todo';
        return (
          <li key={s.n}>
            <button
              type="button"
              disabled={!reachable}
              onClick={() => onStepClick(s.n)}
              aria-current={s.n === currentStep ? 'step' : undefined}
              aria-label={`Step ${s.n}: ${s.label}`}
              className="block w-full py-2 cursor-pointer disabled:cursor-default group"
            >
              <span
                className={`block h-1.5 rounded-full transition-colors duration-300 ${
                  state === 'current'
                    ? 'bg-signal'
                    : state === 'done'
                    ? 'bg-ink group-hover:bg-muted'
                    : state === 'reached'
                    ? 'bg-soft'
                    : 'bg-hairline'
                }`}
              />
            </button>
          </li>
        );
      })}
    </ol>
  </nav>
);
