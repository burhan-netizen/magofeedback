import React from 'react';
import { ClientInfo, Ratings, FeedbackData, TestimonialData, ReferralEntry, FormStep } from '../types';
import { ArrowLeft, ArrowRight, Edit3, Star, CheckCircle2, User, ThumbsUp, Quote, Users, Loader2 } from 'lucide-react';

interface Step6Props {
  client: ClientInfo;
  ratings: Ratings;
  feedback: FeedbackData;
  testimonial: TestimonialData;
  referrals: ReferralEntry[];
  onEditStep: (step: FormStep) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export const Step6Review: React.FC<Step6Props> = ({
  client,
  ratings,
  feedback,
  testimonial,
  referrals,
  onEditStep,
  onBack,
  onSubmit,
  isSubmitting,
}) => {
  const validReferrals = referrals.filter(
    (r) => r.name.trim() || r.company.trim() || r.phone.trim() || r.service.trim()
  );

  return (
    <div id="step-6-review" className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Almost Done!
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Please review your details below. You can jump back to edit any section before final submission.
        </p>
      </div>

      <div className="space-y-4">
        {/* Section 1: Client Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>1. Client Information</span>
            </div>
            <button
              type="button"
              id="btn-edit-step1"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Name</span>
              <span className="font-semibold text-slate-900">{client.name || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Company</span>
              <span className="font-medium text-slate-700">{client.company || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Email</span>
              <span className="font-medium text-slate-700">{client.email || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Ratings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>2. Experience Ratings</span>
            </div>
            <button
              type="button"
              id="btn-edit-step2"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {[
              { label: 'Overall Experience', score: ratings.overall },
              { label: 'Quality of Work', score: ratings.quality },
              { label: 'Communication', score: ratings.communication },
              { label: 'Timeliness', score: ratings.timeliness },
              { label: 'Value for Money', score: ratings.value },
            ].map((item) => (
              <div key={item.label} className="p-2.5 bg-slate-50/70 rounded-xl">
                <span className="text-xs text-slate-500 block mb-1">{item.label}</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= item.score ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-600">
                    {item.score}/5 ({RATING_LABELS[item.score] || 'N/A'})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Feedback & Recommendation */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <ThumbsUp className="w-3.5 h-3.5 text-slate-600" />
              <span>3. Feedback & Recommendation</span>
            </div>
            <button
              type="button"
              id="btn-edit-step3"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-2.5 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Would recommend Mago Labs</span>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                {feedback.recommendation || 'Not specified'}
              </span>
            </div>

            {feedback.liked && (
              <div>
                <span className="text-xs text-slate-400 block">What you liked most</span>
                <p className="text-slate-700 text-xs sm:text-sm mt-0.5 italic whitespace-pre-wrap bg-slate-50/50 p-2 rounded-lg">
                  &ldquo;{feedback.liked}&rdquo;
                </p>
              </div>
            )}

            {feedback.improvements && (
              <div>
                <span className="text-xs text-slate-400 block">Suggested improvements</span>
                <p className="text-slate-700 text-xs sm:text-sm mt-0.5 italic whitespace-pre-wrap bg-slate-50/50 p-2 rounded-lg">
                  &ldquo;{feedback.improvements}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Testimonial */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Quote className="w-3.5 h-3.5 text-slate-600" />
              <span>4. Testimonial</span>
            </div>
            <button
              type="button"
              id="btn-edit-step4"
              onClick={() => onEditStep(4)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="text-sm">
            {testimonial.text ? (
              <div className="space-y-2">
                <p className="text-slate-800 text-xs sm:text-sm italic bg-slate-50/80 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <CheckCircle2 className={`w-4 h-4 ${testimonial.permission ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>
                    {testimonial.permission
                      ? 'Permission granted to use in marketing & website'
                      : 'Private feedback only (not permitted for marketing)'}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">No testimonial written</span>
            )}
          </div>
        </div>

        {/* Section 5: Referrals */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>5. Referrals ({validReferrals.length})</span>
            </div>
            <button
              type="button"
              id="btn-edit-step5"
              onClick={() => onEditStep(5)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {validReferrals.length > 0 ? (
            <div className="space-y-2.5">
              {validReferrals.map((r, i) => (
                <div key={r.id || i} className="p-3 bg-slate-50/80 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-900">#{i + 1} {r.name || 'Unnamed contact'}</span>
                    {r.company && <span className="text-slate-500"> ({r.company})</span>}
                  </div>
                  <div className="text-slate-600 flex items-center gap-3">
                    {r.phone && <span>📞 {r.phone}</span>}
                    {r.service && <span className="bg-slate-200/80 px-2 py-0.5 rounded text-[11px] font-medium">{r.service}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">No referrals added</span>
          )}
        </div>
      </div>

      {/* Submit banner */}
      <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              Submit Your Feedback
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Thank you for taking the time to share your experience with Mago Labs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              id="btn-step6-back"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors duration-200 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              id="btn-submit-feedback"
              onClick={onSubmit}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={`inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isSubmitting ? 'cursor-not-allowed opacity-75' : 'cursor-pointer active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Submitting Feedback...</span>
                </>
              ) : (
                <>
                  <span>Submit Feedback</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
