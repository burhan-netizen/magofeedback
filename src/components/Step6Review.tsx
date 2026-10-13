import React from 'react';
import { ClientInfo, FeedbackData, FormStep, Ratings, ReferralEntry, TestimonialData } from '../types';
import { StepHeader, StepNav } from './ui';
import { isComplete } from './Step5Referrals';

interface Step6Props {
  client: ClientInfo;
  ratings: Ratings;
  feedback: FeedbackData;
  testimonial: TestimonialData;
  referrals: ReferralEntry[];
  honeypot: string;
  onHoneypot: (v: string) => void;
  onEditStep: (step: FormStep) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string;
}

const Stars: React.FC<{ n: number }> = ({ n }) => (
  <span className="tracking-[0.12em] text-[#e0a92a]" aria-label={`${n} of 5`}>
    {'★'.repeat(n)}
    <span className="text-hairline">{'★'.repeat(5 - n)}</span>
  </span>
);

const Section: React.FC<{ title: string; step: FormStep; onEdit: (s: FormStep) => void; children: React.ReactNode }> = ({
  title,
  step,
  onEdit,
  children,
}) => (
  <section className="py-5 border-t border-hairline first:border-t-0 first:pt-0">
    <div className="flex items-center justify-between mb-2">
      <h3 className="ml-eyebrow text-ink">{title}</h3>
      <button type="button" className="ml-link-btn" onClick={() => onEdit(step)}>
        Edit
      </button>
    </div>
    <div className="text-[14px] leading-relaxed text-ink">{children}</div>
  </section>
);

const Empty = () => <span className="text-soft">Skipped</span>;

export const Step6Review: React.FC<Step6Props> = ({
  client,
  ratings,
  feedback,
  testimonial,
  referrals,
  honeypot,
  onHoneypot,
  onEditStep,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const done = referrals.filter(isComplete);
  const details: Array<[string, number]> = [
    ['Quality', ratings.quality],
    ['Communication', ratings.communication],
    ['Timeliness', ratings.timeliness],
    ['Value', ratings.value],
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isSubmitting) onSubmit();
      }}
      noValidate
    >
      <StepHeader eyebrow="Step 06 / Review" title="All good? Send it over." intro="Quick look before it goes. Tap Edit to change anything." />

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div className="ml-honeypot" aria-hidden="true">
        <label htmlFor="company_website">Leave this empty</label>
        <input
          id="company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => onHoneypot(e.target.value)}
        />
      </div>

      <div>
        <Section title="About you" step={1} onEdit={onEditStep}>
          <p className="font-semibold">{client.name}</p>
          <p className="text-muted">
            {[client.role, client.company].filter(Boolean).join(', ') || null}
            {(client.role || client.company) && <br />}
            {client.email}
          </p>
        </Section>

        <Section title="Your rating" step={2} onEdit={onEditStep}>
          <p className="flex items-center gap-3">
            <Stars n={ratings.overall} /> <span className="font-semibold">Overall</span>
          </p>
          <p className="mt-1 text-muted">Would recommend: <span className="text-ink font-medium">{feedback.recommendation || 'Not answered'}</span></p>
          {details.some(([, v]) => v > 0) && (
            <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-muted">
              {details
                .filter(([, v]) => v > 0)
                .map(([k, v]) => (
                  <li key={k} className="flex justify-between gap-2">
                    <span>{k}</span>
                    <span className="text-ink font-medium">{v}/5</span>
                  </li>
                ))}
            </ul>
          )}
        </Section>

        <Section title="In your words" step={3} onEdit={onEditStep}>
          <p className="text-muted">Liked most</p>
          <p className="whitespace-pre-line">{feedback.liked || <Empty />}</p>
          <p className="text-muted mt-2">Could do better</p>
          <p className="whitespace-pre-line">{feedback.improvements || <Empty />}</p>
        </Section>

        <Section title="Testimonial" step={4} onEdit={onEditStep}>
          {testimonial.text || testimonial.photo ? (
            <div className="flex gap-4 items-start">
              {testimonial.photo && (
                <img src={testimonial.photo} alt="" className="w-12 h-12 rounded-lg object-cover border border-hairline shrink-0" />
              )}
              <div>
                {testimonial.text && <p className="italic whitespace-pre-line">"{testimonial.text}"</p>}
                <p className="mt-1 text-[12px] text-muted">
                  {testimonial.permission ? 'OK to share publicly' : 'Keep private'}
                </p>
              </div>
            </div>
          ) : (
            <Empty />
          )}
        </Section>

        <Section title={`Referrals (${done.length})`} step={5} onEdit={onEditStep}>
          {done.length ? (
            <ul className="space-y-1.5">
              {done.map((r) => (
                <li key={r.id}>
                  <span className="font-medium">{r.name}</span>
                  {r.company && <span className="text-muted">, {r.company}</span>}
                  {r.services.length > 0 && <span className="text-muted"> / {r.services.join(', ')}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <Empty />{' '}
              <button type="button" className="ml-link-btn ml-2" onClick={() => onEditStep(5)}>
                Add one now
              </button>
            </p>
          )}
        </Section>
      </div>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-danger/40 bg-[#fff4ed] p-4 text-[14px] text-danger font-medium">
          {error}
        </div>
      )}

      <StepNav onBack={onBack} continueLabel={isSubmitting ? 'Sending...' : 'Send my feedback'} continueDisabled={isSubmitting} />
    </form>
  );
};
