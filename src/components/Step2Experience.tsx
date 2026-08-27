import React, { useState } from 'react';
import { Ratings } from '../types';
import { StarRating } from './StarRating';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Step2Props {
  ratings: Ratings;
  onUpdate: (ratings: Partial<Ratings>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Experience: React.FC<Step2Props> = ({
  ratings,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  const errors: Partial<Record<keyof Ratings, string>> = {};
  if (submittedAttempt) {
    if (!ratings.overall) errors.overall = 'Please select a rating for Overall Experience';
    if (!ratings.quality) errors.quality = 'Please select a rating for Quality of Work';
    if (!ratings.communication) errors.communication = 'Please select a rating for Communication';
    if (!ratings.timeliness) errors.timeliness = 'Please select a rating for Timeliness';
    if (!ratings.value) errors.value = 'Please select a rating for Value for Money';
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);

    if (
      ratings.overall > 0 &&
      ratings.quality > 0 &&
      ratings.communication > 0 &&
      ratings.timeliness > 0 &&
      ratings.value > 0
    ) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleContinue} id="step-2-form" className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          How was your experience with Mago Labs?
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Please rate each key aspect of our collaboration from 1 (Poor) to 5 (Excellent).
        </p>
      </div>

      <div className="bg-slate-50/50 rounded-2xl p-2 sm:p-4 border border-slate-200/70 shadow-xs">
        <StarRating
          id="overall"
          label="Overall Experience"
          value={ratings.overall}
          onChange={(rating) => onUpdate({ overall: rating })}
          error={errors.overall}
          description="Your overall satisfaction working with the Mago Labs team"
        />

        <StarRating
          id="quality"
          label="Quality of Work"
          value={ratings.quality}
          onChange={(rating) => onUpdate({ quality: rating })}
          error={errors.quality}
          description="Technical execution, design aesthetics, and attention to detail"
        />

        <StarRating
          id="communication"
          label="Communication"
          value={ratings.communication}
          onChange={(rating) => onUpdate({ communication: rating })}
          error={errors.communication}
          description="Clarity, responsiveness, proactive updates, and transparency"
        />

        <StarRating
          id="timeliness"
          label="Timeliness"
          value={ratings.timeliness}
          onChange={(rating) => onUpdate({ timeliness: rating })}
          error={errors.timeliness}
          description="Adherence to milestones, deadlines, and delivery schedules"
        />

        <StarRating
          id="value"
          label="Value for Money"
          value={ratings.value}
          onChange={(rating) => onUpdate({ value: rating })}
          error={errors.value}
          description="Return on investment and overall business impact delivered"
        />
      </div>

      {submittedAttempt && Object.keys(errors).length > 0 && (
        <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-xs font-semibold text-rose-600">
          Please rate all 5 categories above to proceed.
        </div>
      )}

      <div className="pt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          id="btn-step2-back"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          id="btn-step2-continue"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

