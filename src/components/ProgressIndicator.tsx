import React from 'react';
import { FormStep } from '../types';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: FormStep;
  onStepClick?: (step: FormStep) => void;
  highestStepReached: FormStep;
}

interface StepMeta {
  number: FormStep;
  label: string;
}

const STEPS: StepMeta[] = [
  { number: 1, label: 'ABOUT YOU' },
  { number: 2, label: 'EXPERIENCE' },
  { number: 3, label: 'FEEDBACK' },
  { number: 4, label: 'TESTIMONIAL' },
  { number: 5, label: 'REFERRALS' },
  { number: 6, label: 'SUBMIT' },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  onStepClick,
  highestStepReached,
}) => {
  return (
    <div className="w-full mb-8" id="progress-indicator">
      {/* Mobile step status bar */}
      <div className="md:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs mb-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold">
            {currentStep}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {STEPS[currentStep - 1].label}
          </span>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Step {currentStep} of 6
        </span>
      </div>

      {/* Mobile progress bar line */}
      <div className="md:hidden w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-slate-900 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / 6) * 100}%` }}
        />
      </div>

      {/* Desktop navigation bar matching Professional Polish theme */}
      <nav
        aria-label="Progress"
        className="hidden md:flex items-center justify-between px-3.5 lg:px-5 py-3 bg-slate-50 border border-slate-200/70 rounded-2xl shadow-xs overflow-hidden"
      >
        <ol className="flex items-center justify-between w-full gap-1">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isAccessible = step.number <= highestStepReached;
            const isLast = idx === STEPS.length - 1;

            return (
              <li
                key={step.number}
                className={`relative flex items-center min-w-0 ${isLast ? 'flex-none' : 'flex-1'}`}
              >
                <button
                  type="button"
                  id={`progress-step-${step.number}`}
                  disabled={!isAccessible}
                  onClick={() => onStepClick && isAccessible && onStepClick(step.number)}
                  className={`group flex items-center gap-1.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg px-1.5 py-1 shrink-0 ${
                    isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 transition-all duration-200 ${
                      isCurrent
                        ? 'bg-slate-900 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-slate-200 text-slate-800 group-hover:bg-slate-300'
                        : 'border border-slate-300 text-slate-400 bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      step.number
                    )}
                  </span>
                  <span
                    className={`text-[10px] lg:text-[11px] font-bold tracking-wider uppercase whitespace-nowrap transition-colors duration-200 ${
                      isCurrent
                        ? 'text-slate-900'
                        : isCompleted
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {!isLast && (
                  <div
                    className="flex-1 min-w-[6px] max-w-[24px] mx-1 lg:mx-2 h-px bg-slate-200/80 transition-colors"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full bg-slate-900 transition-all duration-300 ${
                        currentStep > step.number ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

