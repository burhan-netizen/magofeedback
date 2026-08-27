import React from 'react';
import { ReferralEntry } from '../types';
import { ArrowLeft, ArrowRight, Plus, Trash2, User, Building2, Phone, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Step5Props {
  referrals: ReferralEntry[];
  onAddReferral: () => void;
  onRemoveReferral: (id: string) => void;
  onUpdateReferral: (id: string, field: keyof Omit<ReferralEntry, 'id'>, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step5Referrals: React.FC<Step5Props> = ({
  referrals,
  onAddReferral,
  onRemoveReferral,
  onUpdateReferral,
  onNext,
  onBack,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} id="step-5-form" className="space-y-6">
      {/* Header and Introductory copy */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>🤝</span> Help Us Grow Through Referrals
        </h2>
        <div className="mt-3 p-4 bg-slate-50/90 border-l-4 border-slate-900 rounded-r-xl text-sm text-slate-700 leading-relaxed">
          Many of our projects come through recommendations from satisfied clients. If you know any{' '}
          <strong className="text-slate-900 font-semibold">
            business owners, professionals, or companies
          </strong>{' '}
          that could benefit from a professional website, e-commerce store, SEO, branding, or digital marketing services, we&apos;d greatly appreciate an introduction.
        </div>
      </div>

      {/* Referrals dynamic list */}
      <div className="space-y-5" id="referrals-container">
        <AnimatePresence initial={false}>
          {referrals.map((referral, index) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              id={`referral-card-${index + 1}`}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Referral #{index + 1}
                  </h3>
                </div>

                <button
                  type="button"
                  id={`btn-remove-referral-${index + 1}`}
                  onClick={() => onRemoveReferral(referral.id)}
                  aria-label={`Remove Referral #${index + 1}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Referral Name */}
                <div>
                  <label
                    htmlFor={`referral-name-${referral.id}`}
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      id={`referral-name-${referral.id}`}
                      value={referral.name}
                      onChange={(e) => onUpdateReferral(referral.id, 'name', e.target.value)}
                      placeholder="Contact Name"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 text-slate-900 rounded-xl border border-slate-200 text-sm transition-all focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                </div>

                {/* Referral Company */}
                <div>
                  <label
                    htmlFor={`referral-company-${referral.id}`}
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Company
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      id={`referral-company-${referral.id}`}
                      value={referral.company}
                      onChange={(e) => onUpdateReferral(referral.id, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 text-slate-900 rounded-xl border border-slate-200 text-sm transition-all focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                </div>

                {/* Referral Phone */}
                <div>
                  <label
                    htmlFor={`referral-phone-${referral.id}`}
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      id={`referral-phone-${referral.id}`}
                      value={referral.phone}
                      onChange={(e) => onUpdateReferral(referral.id, 'phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 text-slate-900 rounded-xl border border-slate-200 text-sm transition-all focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                </div>

                {/* Referral Service */}
                <div>
                  <label
                    htmlFor={`referral-service-${referral.id}`}
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    What service might they need?
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      id={`referral-service-${referral.id}`}
                      value={referral.service}
                      onChange={(e) => onUpdateReferral(referral.id, 'service', e.target.value)}
                      placeholder="e.g. Website, E-commerce, Branding, Software..."
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 text-slate-900 rounded-xl border border-slate-200 text-sm transition-all focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Referral Button */}
        <div className="pt-1">
          <button
            type="button"
            id={referrals.length === 0 ? 'btn-add-first-referral' : 'btn-add-another-referral'}
            onClick={onAddReferral}
            className={`w-full py-4 px-6 rounded-2xl border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-2.5 font-bold text-xs uppercase tracking-wider cursor-pointer ${
              referrals.length === 0
                ? 'border-slate-300 bg-white hover:border-slate-900 hover:bg-slate-50 text-slate-900 shadow-xs'
                : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-400 text-slate-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>
              {referrals.length === 0 ? '+ Add a Referral' : '+ Add Another Referral'}
            </span>
          </button>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          id="btn-step5-back"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          id="btn-step5-continue"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

