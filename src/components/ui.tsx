import React from 'react';

export const StepHeader: React.FC<{
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
}> = ({ eyebrow, title, intro }) => (
  <div className="pb-6 mb-6 border-b border-hairline">
    <p className="ml-eyebrow flex items-center gap-2">
      <span className="inline-block w-2 h-2 bg-signal" aria-hidden="true" />
      {eyebrow}
    </p>
    <h2 className="mt-3 text-[26px] sm:text-[32px] leading-[1.15] font-bold tracking-tight text-ink">{title}</h2>
    {intro && <div className="mt-3 text-[15px] leading-relaxed text-muted max-w-xl">{intro}</div>}
  </div>
);

export const StepNav: React.FC<{
  onBack?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  extra?: React.ReactNode;
}> = ({ onBack, continueLabel = 'Continue', continueDisabled, extra }) => (
  <div className="pt-8 mt-8 border-t border-hairline flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
    <div>
      {onBack && (
        <button type="button" onClick={onBack} className="ml-btn-ghost w-full sm:w-auto">
          Back
        </button>
      )}
    </div>
    <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3">
      {extra}
      <button type="submit" disabled={continueDisabled} className="ml-btn-primary w-full sm:w-auto">
        {continueLabel}
        <span aria-hidden="true">→</span>
      </button>
    </div>
  </div>
);

export const OptionalTag = () => (
  <span className="ml-1.5 font-mono text-[10px] font-semibold tracking-wider uppercase text-soft align-middle">
    Optional
  </span>
);
