import React from 'react';
import { FeedbackData } from '../types';
import { OptionalTag, StepHeader, StepNav } from './ui';

interface Step3Props {
  data: FeedbackData;
  overall: number;
  onUpdate: (data: Partial<FeedbackData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Feedback: React.FC<Step3Props> = ({ data, overall, onUpdate, onNext, onBack }) => {
  const lowScore = overall > 0 && overall <= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader
        eyebrow="Step 03 / In your words"
        title={lowScore ? 'Thanks for being straight with us.' : 'Tell us what stood out.'}
        intro={
          lowScore
            ? 'We read every answer personally. Tell us what fell short and Burhan will reach out to make it right.'
            : 'A sentence or two is plenty. Short and honest beats long and polished.'
        }
      />

      <div className="space-y-6">
        <div>
          <label htmlFor="fb-liked" className="ml-label">
            What did you like most about working with us?
            <OptionalTag />
          </label>
          <textarea
            id="fb-liked"
            rows={4}
            className="ml-input resize-y min-h-[112px]"
            value={data.liked}
            onChange={(e) => onUpdate({ liked: e.target.value })}
            placeholder="The process, the design, a result you noticed after launch..."
          />
        </div>

        <div>
          <label htmlFor="fb-improve" className="ml-label">
            {lowScore ? 'What went wrong, and what should we have done instead?' : 'One thing we could do better next time?'}
            <OptionalTag />
          </label>
          <textarea
            id="fb-improve"
            rows={4}
            className="ml-input resize-y min-h-[112px]"
            value={data.improvements}
            onChange={(e) => onUpdate({ improvements: e.target.value })}
            placeholder="Nothing is too small to mention."
          />
        </div>
      </div>

      <StepNav onBack={onBack} />
    </form>
  );
};
