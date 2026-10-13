import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MagoLabsLogo } from './components/MagoLabsLogo';
import { ProgressIndicator } from './components/ProgressIndicator';
import { Step1AboutYou } from './components/Step1AboutYou';
import { Step2Experience } from './components/Step2Experience';
import { Step3Feedback } from './components/Step3Feedback';
import { Step4Testimonial } from './components/Step4Testimonial';
import { Step5Referrals, isComplete } from './components/Step5Referrals';
import { Step6Review } from './components/Step6Review';
import { SuccessScreen } from './components/SuccessScreen';
import {
  ClientInfo,
  FeedbackData,
  FeedbackSubmission,
  FormStep,
  Ratings,
  RecommendationOption,
  ReferralEntry,
  TestimonialData,
} from './types';
import { clearDraft, loadDraft, saveDraft, submitFeedback } from './services/feedbackService';

interface FormStateDraft {
  step: FormStep;
  highestStepReached: FormStep;
  client: Partial<ClientInfo>;
  ratings: Partial<Ratings>;
  feedback: Partial<FeedbackData>;
  testimonial: Partial<TestimonialData>;
  referrals: Array<Partial<ReferralEntry>>;
  startedAt?: number;
}

const EMPTY_CLIENT: ClientInfo = { name: '', company: '', role: '', email: '' };
const EMPTY_RATINGS: Ratings = { overall: 0, quality: 0, communication: 0, timeliness: 0, value: 0 };
const EMPTY_FEEDBACK: FeedbackData = { liked: '', improvements: '', recommendation: '' };
const EMPTY_TESTIMONIAL: TestimonialData = { text: '', permission: true, photo: '', photoName: '' };

const newReferral = (preset: Partial<ReferralEntry> = {}): ReferralEntry => ({
  id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  name: '',
  company: '',
  phone: '',
  email: '',
  relationship: '',
  services: [],
  mentionMe: true,
  ...preset,
});

export default function App() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [highestStepReached, setHighestStepReached] = useState<FormStep>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submission, setSubmission] = useState<FeedbackSubmission | null>(null);

  const [client, setClient] = useState<ClientInfo>(EMPTY_CLIENT);
  const [ratings, setRatings] = useState<Ratings>(EMPTY_RATINGS);
  const [feedback, setFeedback] = useState<FeedbackData>(EMPTY_FEEDBACK);
  const [testimonial, setTestimonial] = useState<TestimonialData>(EMPTY_TESTIMONIAL);
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [honeypot, setHoneypot] = useState('');
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // Restore a saved draft so clients can pick up where they left off.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const saved = await loadDraft<FormStateDraft>();
        if (saved && alive) {
          setClient({ ...EMPTY_CLIENT, ...saved.client });
          setRatings({ ...EMPTY_RATINGS, ...saved.ratings });
          setFeedback({ ...EMPTY_FEEDBACK, ...saved.feedback });
          setTestimonial({ ...EMPTY_TESTIMONIAL, ...saved.testimonial });
          if (Array.isArray(saved.referrals)) {
            setReferrals(
              saved.referrals.map((r) => ({
                ...newReferral(),
                ...r,
                services: Array.isArray(r.services) ? r.services : [],
              }))
            );
          }
          if (saved.highestStepReached) setHighestStepReached(saved.highestStepReached);
          if (saved.step && saved.step <= 6) setCurrentStep(saved.step);
          if (saved.startedAt) setStartedAt(saved.startedAt);
        }
      } catch {
        /* no draft, start fresh */
      } finally {
        if (alive) setIsDraftLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!isDraftLoaded || isSubmitted) return;
    saveDraft({ step: currentStep, highestStepReached, client, ratings, feedback, testimonial, referrals, startedAt });
  }, [isDraftLoaded, isSubmitted, currentStep, highestStepReached, client, ratings, feedback, testimonial, referrals, startedAt]);

  // Open the referral step with two cards ready, so one or two names feels like the norm.
  useEffect(() => {
    if (currentStep === 5 && referrals.length === 0) {
      setReferrals([newReferral(), newReferral()]);
    }
  }, [currentStep, referrals.length]);

  const scrollToCard = () =>
    requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return window.scrollTo({ top: 0, behavior: 'smooth' });
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    });

  const goTo = (step: FormStep) => {
    setCurrentStep(step);
    setHighestStepReached((prev) => (step > prev ? step : prev));
    setSubmitError('');
    scrollToCard();
  };
  const handleNext = () => goTo(Math.min(6, currentStep + 1) as FormStep);
  const handleBack = () => currentStep > 1 && goTo((currentStep - 1) as FormStep);
  const handleStepJump = (step: FormStep) => step <= highestStepReached && goTo(step);

  const addReferral = (preset?: Partial<ReferralEntry>) => {
    const r = newReferral(preset);
    setReferrals((prev) => [...prev, r]);
    return r.id;
  };
  const removeReferral = (id: string) => setReferrals((prev) => prev.filter((r) => r.id !== id));
  const updateReferral = <K extends keyof Omit<ReferralEntry, 'id'>>(id: string, field: K, value: ReferralEntry[K]) =>
    setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    const hasTestimonial = !!(testimonial.text.trim() || testimonial.photo);

    const payload: FeedbackSubmission = {
      client: {
        name: client.name.trim(),
        company: client.company.trim(),
        role: client.role.trim(),
        email: client.email.trim(),
      },
      ratings: { ...ratings },
      feedback: {
        liked: feedback.liked.trim(),
        improvements: feedback.improvements.trim(),
        recommendation: feedback.recommendation,
      },
      testimonial: {
        text: testimonial.text.trim(),
        permission: hasTestimonial ? testimonial.permission : false,
        photo: testimonial.photo || undefined,
        photoName: testimonial.photoName || undefined,
      },
      referrals: referrals.filter(isComplete).map(({ id: _id, ...r }) => ({
        ...r,
        name: r.name.trim(),
        company: r.company.trim(),
        phone: r.phone.trim(),
        email: r.email.trim(),
        relationship: r.relationship.trim(),
      })),
      hp: honeypot,
      startedAt,
    };

    try {
      await submitFeedback(payload);
      setSubmission(payload);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? `${err.message} Your answers are saved, so you can try again in a moment. If it keeps failing, email burhan@magolabs.in.`
          : 'Something went wrong. Your answers are saved, so please try again in a moment.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    clearDraft();
    setClient(EMPTY_CLIENT);
    setRatings(EMPTY_RATINGS);
    setFeedback(EMPTY_FEEDBACK);
    setTestimonial(EMPTY_TESTIMONIAL);
    setReferrals([]);
    setCurrentStep(1);
    setHighestStepReached(1);
    setStartedAt(Date.now());
    setIsSubmitted(false);
    setSubmission(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayName = [client.name.trim(), [client.role.trim(), client.company.trim()].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-hairline">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="https://www.magolabs.in" target="_blank" rel="noopener noreferrer" aria-label="Mago Labs website">
            <MagoLabsLogo />
          </a>
          <span className="ml-eyebrow hidden sm:inline">Client feedback</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!isSubmitted ? (
          <>
            {currentStep === 1 && (
              <div className="mb-10">
                <p className="ml-eyebrow">About 2 minutes / 6 short steps</p>
                <h1 className="mt-4 text-[36px] sm:text-[52px] leading-[1.05] font-bold tracking-tight">
                  How did we{' '}
                  <span className="ml-mark">do?</span>
                </h1>
                <p className="mt-5 text-[16px] sm:text-[17px] leading-relaxed text-muted max-w-xl">
                  Thank you for trusting Mago Labs with your business. Your honest feedback shapes how we work, and
                  every answer is read personally by Burhan, our founder.
                </p>
              </div>
            )}

            <ProgressIndicator currentStep={currentStep} highestStepReached={highestStepReached} onStepClick={handleStepJump} />

            <div ref={cardRef} className="ml-card p-5 sm:p-10 scroll-mt-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {currentStep === 1 && (
                    <Step1AboutYou data={client} onUpdate={(d) => setClient((p) => ({ ...p, ...d }))} onNext={handleNext} />
                  )}
                  {currentStep === 2 && (
                    <Step2Experience
                      ratings={ratings}
                      recommendation={feedback.recommendation}
                      onUpdate={(r) => setRatings((p) => ({ ...p, ...r }))}
                      onRecommendation={(v: RecommendationOption) => setFeedback((p) => ({ ...p, recommendation: v }))}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3Feedback
                      data={feedback}
                      overall={ratings.overall}
                      onUpdate={(d) => setFeedback((p) => ({ ...p, ...d }))}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4Testimonial
                      data={testimonial}
                      liked={feedback.liked}
                      displayName={displayName}
                      onUpdate={(d) => setTestimonial((p) => ({ ...p, ...d }))}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 5 && (
                    <Step5Referrals
                      referrals={referrals}
                      overall={ratings.overall}
                      onAddReferral={addReferral}
                      onRemoveReferral={removeReferral}
                      onUpdateReferral={updateReferral}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 6 && (
                    <Step6Review
                      client={client}
                      ratings={ratings}
                      feedback={feedback}
                      testimonial={testimonial}
                      referrals={referrals}
                      honeypot={honeypot}
                      onHoneypot={setHoneypot}
                      onEditStep={handleStepJump}
                      onBack={handleBack}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      error={submitError}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="mt-6 text-center text-[12px] text-muted">
              Your answers save on this device as you go, so you can close the page and pick up later.
            </p>
          </>
        ) : (
          <SuccessScreen submission={submission} onReset={handleReset} />
        )}
      </main>

      <footer className="border-t border-hairline">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="https://www.magolabs.in" target="_blank" rel="noopener noreferrer" aria-label="Mago Labs website">
            <MagoLabsLogo size="sm" />
          </a>
          <div className="flex items-center gap-5">
            <a href="mailto:burhan@magolabs.in" className="ml-eyebrow hover:text-ink transition-colors">
              burhan@magolabs.in
            </a>
            <a
              href="https://www.magolabs.in"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-eyebrow hover:text-ink transition-colors"
            >
              magolabs.in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
