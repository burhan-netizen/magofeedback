import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StarRatingProps {
  id: string;
  label: string;
  value: number;
  onChange: (rating: number) => void;
  required?: boolean;
  error?: string;
  description?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export const StarRating: React.FC<StarRatingProps> = ({
  id,
  label,
  value,
  onChange,
  required = true,
  error,
  description,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const activeValue = hoverValue !== null ? hoverValue : value;
  const currentLabel = activeValue > 0 ? RATING_LABELS[activeValue] : '';

  return (
    <div className="py-4 border-b border-slate-100 last:border-b-0" id={`rating-group-${id}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-2.5">
        <div>
          <label htmlFor={`star-rating-${id}`} className="text-sm sm:text-base font-medium text-slate-800 flex items-center gap-1.5">
            {label}
            {required && <span className="text-amber-500 text-sm font-normal" title="Required">*</span>}
          </label>
          {description && (
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          )}
        </div>

        {/* Rating descriptor badge */}
        <div className="min-w-24 text-left sm:text-right h-6 flex items-center sm:justify-end">
          <AnimatePresence mode="wait">
            {currentLabel ? (
              <motion.span
                key={activeValue}
                initial={{ opacity: 0, scale: 0.85, y: 2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  activeValue >= 4
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : activeValue === 3
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    : 'bg-orange-50 text-orange-700 border border-orange-200/60'
                }`}
              >
                {activeValue} - {currentLabel}
              </motion.span>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium tracking-tight">Select 1–5 stars</span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stars row with subtle spring micro-interactions */}
      <div
        id={`star-rating-${id}`}
        role="radiogroup"
        aria-label={`${label} rating out of 5 stars`}
        className="flex items-center gap-1.5 sm:gap-2 mt-1 focus:outline-none"
        onMouseLeave={() => setHoverValue(null)}
      >
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= activeValue;
          const isSelected = starIndex === value;

          return (
            <motion.button
              key={starIndex}
              type="button"
              id={`star-${id}-${starIndex}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${starIndex} Star - ${RATING_LABELS[starIndex]}`}
              whileHover={{ scale: 1.14 }}
              whileTap={{ scale: 0.86 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              onClick={() => onChange(starIndex)}
              onMouseEnter={() => setHoverValue(starIndex)}
              onFocus={() => setHoverValue(starIndex)}
              onBlur={() => setHoverValue(null)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  onChange(Math.min(5, (value || 0) + 1));
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  onChange(Math.max(1, (value || 1) - 1));
                }
              }}
              className={`group relative p-2 sm:p-2.5 rounded-xl transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 touch-manipulation cursor-pointer ${
                isFilled
                  ? 'bg-amber-50/80 text-amber-500 hover:bg-amber-100/90 shadow-xs'
                  : 'bg-slate-100/70 text-slate-300 hover:bg-slate-200/60 hover:text-slate-400'
              }`}
            >
              <motion.div
                animate={
                  isSelected
                    ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }
                    : { scale: isFilled ? 1.05 : 1, rotate: 0 }
                }
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Star
                  className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-150 ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-transparent text-slate-300 group-hover:text-slate-400'
                  }`}
                  strokeWidth={1.75}
                />
              </motion.div>

              {/* Floating Tooltip */}
              <div
                role="tooltip"
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-semibold tracking-wide rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-20 translate-y-1 group-hover:translate-y-0"
              >
                {starIndex} - {RATING_LABELS[starIndex]}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-solid border-b-slate-900 border-b-4 border-x-transparent border-x-4 border-t-0" />
              </div>

              <span className="sr-only">
                {starIndex} of 5 stars ({RATING_LABELS[starIndex]})
              </span>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};


