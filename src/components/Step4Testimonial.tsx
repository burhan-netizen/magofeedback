import React from 'react';
import { TestimonialData } from '../types';
import { ArrowLeft, ArrowRight, Quote, Check } from 'lucide-react';

interface Step4Props {
  data: TestimonialData;
  onUpdate: (data: Partial<TestimonialData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Testimonial: React.FC<Step4Props> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} id="step-4-form" className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Quote className="w-5 h-5 text-slate-400" />
          Want to share your experience?
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          A few words about your experience can help other businesses understand what it&apos;s like to work with Mago Labs.
        </p>
      </div>

      <div className="space-y-5">
        {/* Testimonial Textarea */}
        <div>
          <label
            htmlFor="testimonial-text"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Your Testimonial
          </label>
          <textarea
            id="testimonial-text"
            rows={5}
            value={data.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Write your testimonial here..."
            className="w-full p-4 bg-slate-50/50 text-slate-900 rounded-xl border border-slate-200 text-sm leading-relaxed transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 hover:border-slate-300 resize-y min-h-[140px]"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Feel free to mention project impact, speed of delivery, team collaboration, or results achieved.
          </p>
        </div>

        {/* Marketing Permission Checkbox */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 transition-colors">
          <label
            htmlFor="testimonial-permission"
            className="flex items-start gap-3.5 cursor-pointer select-none group"
          >
            <div className="relative flex items-center mt-0.5">
              <input
                type="checkbox"
                id="testimonial-permission"
                checked={data.permission}
                onChange={(e) => onUpdate({ permission: e.target.checked })}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                  data.permission
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-300 group-hover:border-slate-400'
                }`}
              >
                {data.permission && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
            <div className="text-sm text-slate-700 leading-snug">
              <span className="font-medium text-slate-900">
                I&apos;m happy for Mago Labs to use my testimonial
              </span>{' '}
              on its website, social media, proposals and marketing materials.
            </div>
          </label>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          id="btn-step4-back"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          id="btn-step4-continue"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

