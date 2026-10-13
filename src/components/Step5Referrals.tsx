import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ReferralEntry, SERVICE_OPTIONS } from '../types';
import { OptionalTag, StepHeader, StepNav } from './ui';

type Field = keyof Omit<ReferralEntry, 'id'>;

interface Step5Props {
  referrals: ReferralEntry[];
  overall: number;
  onAddReferral: (preset?: Partial<ReferralEntry>) => string;
  onRemoveReferral: (id: string) => void;
  onUpdateReferral: <K extends Field>(id: string, field: K, value: ReferralEntry[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

const PROMPTS = [
  'A friend or relative who runs a business',
  'A supplier, vendor or partner you work with',
  'Someone who asked who built your website',
  'A business whose website is letting them down',
];

const MAX_REFERRALS = 10;

export const isStarted = (r: ReferralEntry) =>
  !!(r.name.trim() || r.company.trim() || r.phone.trim() || r.email.trim() || r.relationship.trim() || r.services.length);

export const isComplete = (r: ReferralEntry) => !!(r.name.trim() && (r.phone.trim() || r.email.trim()));

const focusName = (id: string) =>
  requestAnimationFrame(() => {
    const el = document.getElementById(`ref-name-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as HTMLInputElement).focus({ preventScroll: true });
    }
  });

export const Step5Referrals: React.FC<Step5Props> = ({
  referrals,
  overall,
  onAddReferral,
  onRemoveReferral,
  onUpdateReferral,
  onNext,
  onBack,
}) => {
  const [tried, setTried] = useState(false);

  const completeCount = referrals.filter(isComplete).length;
  const hasBroken = referrals.some((r) => isStarted(r) && !isComplete(r));

  const usePrompt = (prompt: string) => {
    const target = referrals.find((r) => !isStarted(r));
    if (target) {
      onUpdateReferral(target.id, 'relationship', prompt);
      focusName(target.id);
    } else if (referrals.length < MAX_REFERRALS) {
      const id = onAddReferral({ relationship: prompt });
      focusName(id);
    }
  };

  const addAnother = () => {
    const id = onAddReferral();
    focusName(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (hasBroken) {
      const first = referrals.find((r) => isStarted(r) && !isComplete(r));
      if (first) focusName(first.id);
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader
        eyebrow="Step 05 / Pass it on"
        title={
          <>
            Know a business that deserves <span className="ml-mark">a better website?</span>
          </>
        }
        intro="Most of our work comes through clients who introduce us to people they trust. If someone comes to mind, we will take good care of them."
      />

      {/* Memory joggers */}
      <div>
        <p className="ml-eyebrow">Need a nudge? Think of</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROMPTS.map((p) => (
            <button key={p} type="button" className="ml-chip" onClick={() => usePrompt(p)}>
              <span aria-hidden="true" className="text-[#e0a92a] font-bold">+</span>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Referral cards */}
      <div className="mt-8 space-y-5">
        <AnimatePresence initial={false}>
          {referrals.map((r, index) => {
            const broken = tried && isStarted(r) && !isComplete(r);
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border bg-paper p-4 sm:p-6 ${broken ? 'border-danger' : isComplete(r) ? 'border-ink' : 'border-hairline'}`}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="ml-eyebrow flex items-center gap-2 text-ink">
                    <span className={`inline-block w-2 h-2 ${isComplete(r) ? 'bg-signal' : 'bg-hairline'}`} aria-hidden="true" />
                    Referral {String(index + 1).padStart(2, '0')}
                    {index === 1 && !isStarted(r) && <span className="text-soft font-semibold">/ optional</span>}
                  </p>
                  {referrals.length > 1 && (
                    <button type="button" className="ml-link-btn" onClick={() => onRemoveReferral(r.id)}>
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`ref-name-${r.id}`} className="ml-label">
                      Their name
                    </label>
                    <input
                      id={`ref-name-${r.id}`}
                      className="ml-input"
                      value={r.name}
                      onChange={(e) => onUpdateReferral(r.id, 'name', e.target.value)}
                      placeholder="e.g. Jordan Lee"
                      aria-invalid={broken && !r.name.trim()}
                    />
                  </div>
                  <div>
                    <label htmlFor={`ref-company-${r.id}`} className="ml-label">
                      Their business
                      <OptionalTag />
                    </label>
                    <input
                      id={`ref-company-${r.id}`}
                      className="ml-input"
                      value={r.company}
                      onChange={(e) => onUpdateReferral(r.id, 'company', e.target.value)}
                      placeholder="e.g. Lee Plumbing & Heating"
                    />
                  </div>
                  <div>
                    <label htmlFor={`ref-phone-${r.id}`} className="ml-label">
                      Phone <span className="font-normal text-muted text-[13px]">with country code</span>
                    </label>
                    <input
                      id={`ref-phone-${r.id}`}
                      type="tel"
                      inputMode="tel"
                      className="ml-input"
                      value={r.phone}
                      onChange={(e) => onUpdateReferral(r.id, 'phone', e.target.value)}
                      placeholder="+1 512 555 0142"
                      aria-invalid={broken && !r.phone.trim() && !r.email.trim()}
                    />
                  </div>
                  <div>
                    <label htmlFor={`ref-email-${r.id}`} className="ml-label">
                      Email
                      <OptionalTag />
                    </label>
                    <input
                      id={`ref-email-${r.id}`}
                      type="email"
                      inputMode="email"
                      className="ml-input"
                      value={r.email}
                      onChange={(e) => onUpdateReferral(r.id, 'email', e.target.value)}
                      placeholder="jordan@leeplumbing.com"
                      aria-invalid={broken && !r.phone.trim() && !r.email.trim()}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`ref-rel-${r.id}`} className="ml-label">
                      How do you know them?
                      <OptionalTag />
                    </label>
                    <input
                      id={`ref-rel-${r.id}`}
                      className="ml-input"
                      value={r.relationship}
                      onChange={(e) => onUpdateReferral(r.id, 'relationship', e.target.value)}
                      placeholder="Friend, supplier, neighbour..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <p className="ml-label">
                      What might they need?
                      <OptionalTag />
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SERVICE_OPTIONS.map((s) => {
                        const on = r.services.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            aria-pressed={on}
                            className="ml-chip"
                            onClick={() =>
                              onUpdateReferral(
                                r.id,
                                'services',
                                on ? r.services.filter((x) => x !== s) : [...r.services, s]
                              )
                            }
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <label className="sm:col-span-2 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={r.mentionMe}
                      onChange={(e) => onUpdateReferral(r.id, 'mentionMe', e.target.checked)}
                      className="w-4 h-4 accent-[#0d0d0d] cursor-pointer"
                    />
                    <span className="text-[14px] text-ink">You can tell them I suggested you</span>
                  </label>
                </div>

                {broken && (
                  <p className="ml-error">
                    {!r.name.trim() ? 'Add their name, ' : ''}
                    {!r.phone.trim() && !r.email.trim() ? 'add a phone number or email ' : ''}
                    so we can reach them. Or tap Remove if you changed your mind.
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {referrals.length < MAX_REFERRALS && (
          <button type="button" onClick={addAnother} className="ml-btn-ghost w-full border-dashed">
            <span aria-hidden="true">+</span> Add another person
          </button>
        )}
      </div>

      {/* Progress feedback */}
      {completeCount > 0 && (
        <p className="mt-6 text-[15px] font-medium text-ink flex items-start gap-3" aria-live="polite">
          <span className="mt-1.5 inline-block w-1 h-5 bg-signal shrink-0" aria-hidden="true" />
          {completeCount === 1 ? 'Thank you. We will look after them.' : `Thank you. We will look after all ${completeCount} of them.`}
        </p>
      )}

      {/* Our promise */}
      <div className="mt-6 rounded-2xl bg-ink text-paper p-5 sm:p-6">
        <p className="ml-eyebrow text-soft">Our promise to them</p>
        <p className="mt-2 text-[15px] leading-relaxed">
          One friendly message, mentioning you only if you allow it. No pressure, no spam, no endless follow ups. If
          they are not interested, that is the end of it.
        </p>
      </div>

      {completeCount === 0 && (
        <p className="mt-6 text-[14px] text-muted">No one in mind right now? That is fine, just continue.</p>
      )}

      <StepNav
        onBack={onBack}
        continueLabel={
          completeCount === 0 ? 'Continue' : `Continue with ${completeCount} referral${completeCount > 1 ? 's' : ''}`
        }
      />
    </form>
  );
};
