import React, { useState } from 'react';
import { FeedbackData, RecommendationOption } from '../types';
import { ArrowLeft, ArrowRight, ThumbsUp, Check } from 'lucide-react';

interface Step3Props {
  data: FeedbackData;
  onUpdate: (data: Partial<FeedbackData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const RECOMMEND_OPTIONS: Array<{
  value: RecommendationOption;
  label: string;
  sublabel: string;
}> = [
  { value: 'Definitely', label: 'Definitely', sublabel: '100% would recommend' },
  { value: 'Probably', label: 'Probably', sublabel: 'Very likely to recommend' },
  { value: 'Not Sure', label: 'Not Sure', sublabel: 'Neutral / Undecided' },
  { value: 'Probably Not', label: 'Probably Not', sublabel: 'Unlikely to recommend' },
];

export const Step3Feedback: React.FC<Step3Props> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.recommendation) {
      setError('Please select whether you would recommend Mago Labs');
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <form onSubmit={handleContinue} id="step-3-form" className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Your feedback matters.
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Honest feedback helps us refine our processes and deliver exceptional work.
        </p>
      </div>

      <div className="space-y-5">
        {/* Liked Most Textarea */}
        <div>
          <label
            htmlFor="feedback-liked"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            What did you like most about working with Mago Labs?
          </label>
          <textarea
            id="feedback-liked"
            rows={4}
            value={data.liked}
            onChange={(e) => onUpdate({ liked: e.target.value })}
            placeholder="Tell us about your experience..."
            className="w-full p-4 bg-slate-50/50 text-slate-900 rounded-xl border border-slate-200 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 hover:border-slate-300 resize-y min-h-[110px]"
          />
        </div>

        {/* Improvements Textarea */}
        <div>
          <label
            htmlFor="feedback-improvements"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Is there anything we could improve?
          </label>
          <textarea
            id="feedback-improvements"
            rows={4}
            value={data.improvements}
            onChange={(e) => onUpdate({ improvements: e.target.value })}
            placeholder="We'd love to know how we can serve you better..."
            className="w-full p-4 bg-slate-50/50 text-slate-900 rounded-xl border border-slate-200 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 hover:border-slate-300 resize-y min-h-[110px]"
          />
        </div>

        {/* Recommendation Options */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Would you recommend Mago Labs to others? <span className="text-amber-500" title="Required">*</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Recommendation options">
            {RECOMMEND_OPTIONS.map((option) => {
              const isSelected = data.recommendation === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  id={`recommend-opt-${option.value.toLowerCase().replace(/\s+/g, '-')}`}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    onUpdate({ recommendation: option.value });
                    setError(null);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50/60 text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {option.label}
                    </div>
                    <div className={`text-xs mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {option.sublabel}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-white text-slate-900 border-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-semibold mt-2">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          id="btn-step3-back"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          id="btn-step3-continue"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

