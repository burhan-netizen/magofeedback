import React, { useState } from 'react';
import { Ratings, RecommendationOption } from '../types';
import { StarRating } from './StarRating';
import { OptionalTag, StepHeader, StepNav } from './ui';

interface Step2Props {
  ratings: Ratings;
  recommendation: RecommendationOption;
  onUpdate: (ratings: Partial<Ratings>) => void;
  onRecommendation: (value: RecommendationOption) => void;
  onNext: () => void;
  onBack: () => void;
}

const RECOMMEND_OPTIONS: Array<{ value: Exclude<RecommendationOption, ''>; label: string }> = [
  { value: 'Definitely', label: 'Definitely' },
  { value: 'Probably', label: 'Probably' },
  { value: 'Not Sure', label: 'Not sure' },
  { value: 'Probably Not', label: 'Probably not' },
];

const DETAILS: Array<{ key: Exclude<keyof Ratings, 'overall'>; label: string; description: string }> = [
  { key: 'quality', label: 'Quality of work', description: 'Design, build and attention to detail' },
  { key: 'communication', label: 'Communication', description: 'Clear, quick and easy to reach' },
  { key: 'timeliness', label: 'Timeliness', description: 'Kept to the plan and the dates' },
  { key: 'value', label: 'Value for money', description: 'What you got for what you paid' },
];

export const Step2Experience: React.FC<Step2Props> = ({
  ratings,
  recommendation,
  onUpdate,
  onRecommendation,
  onNext,
  onBack,
}) => {
  const [tried, setTried] = useState(false);
  const overallError = tried && !ratings.overall ? 'Tap a star to rate your overall experience.' : '';
  const recError = tried && !recommendation ? 'Pick one option.' : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (ratings.overall && recommendation) onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader
        eyebrow="Step 02 / Your rating"
        title={
          <>
            How was working with <span className="ml-mark">Mago Labs?</span>
          </>
        }
        intro="Be honest. A 3 we can learn from is worth more than a polite 5."
      />

      <StarRating
        id="overall"
        size="lg"
        label="Overall experience"
        value={ratings.overall}
        onChange={(n) => onUpdate({ overall: n })}
        error={overallError}
      />

      <fieldset className="mt-10">
        <legend className="text-[17px] font-semibold text-ink">Would you recommend us to another business owner?</legend>
        <div role="radiogroup" className="mt-4 flex flex-wrap gap-2">
          {RECOMMEND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={recommendation === opt.value}
              onClick={() => onRecommendation(opt.value)}
              className="ml-chip px-5 py-2.5"
            >
              {opt.label}
            </button>
          ))}
        </div>
        {recError && <p className="ml-error">{recError}</p>}
      </fieldset>

      <div className="mt-10 rounded-2xl border border-hairline bg-paper px-4 sm:px-6 py-2">
        <p className="pt-4 pb-1 text-[15px] font-semibold text-ink">
          A little more detail
          <OptionalTag />
        </p>
        {DETAILS.map((d) => (
          <StarRating
            key={d.key}
            id={d.key}
            label={d.label}
            description={d.description}
            value={ratings[d.key]}
            onChange={(n) => onUpdate({ [d.key]: n })}
          />
        ))}
      </div>

      <StepNav onBack={onBack} />
    </form>
  );
};
