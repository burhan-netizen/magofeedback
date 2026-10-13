import React, { useState } from 'react';

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

interface StarRatingProps {
  id: string;
  label: string;
  description?: string;
  value: number;
  onChange: (rating: number) => void;
  size?: 'lg' | 'sm';
  error?: string;
}

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M12 2.8l2.83 5.74 6.33.92-4.58 4.46 1.08 6.3L12 17.25l-5.66 2.97 1.08-6.3L2.84 9.46l6.33-.92L12 2.8z"
      fill={filled ? 'var(--color-signal)' : 'transparent'}
      stroke={filled ? '#e0a92a' : 'var(--color-soft)'}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const StarRating: React.FC<StarRatingProps> = ({
  id,
  label,
  description,
  value,
  onChange,
  size = 'sm',
  error,
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? value;
  const big = size === 'lg';

  return (
    <div className={big ? '' : 'py-4 border-t border-hairline first:border-t-0'}>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p id={`${id}-label`} className={big ? 'text-[17px] font-semibold text-ink' : 'text-[15px] font-medium text-ink'}>
            {label}
          </p>
          {description && <p className="text-[13px] text-muted mt-0.5">{description}</p>}
        </div>
        <span className="ml-eyebrow shrink-0 min-w-[72px] text-right" aria-live="polite">
          {active ? RATING_LABELS[active] : ''}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className={`flex items-center ${big ? 'gap-2 sm:gap-3 mt-4' : 'gap-1 mt-2'}`}
        onMouseLeave={() => setHover(null)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} of 5, ${RATING_LABELS[n]}`}
            onClick={() => onChange(value === n && !big ? 0 : n)}
            onMouseEnter={() => setHover(n)}
            className={`rounded-xl transition-transform duration-150 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink touch-manipulation cursor-pointer ${
              big ? 'p-1.5 sm:p-2' : 'p-1'
            }`}
          >
            <StarIcon filled={n <= active} className={big ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-7 h-7'} />
          </button>
        ))}
      </div>
      {error && <p className="ml-error">{error}</p>}
    </div>
  );
};
