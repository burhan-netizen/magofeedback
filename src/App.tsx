import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MagoLabsLogo } from './components/MagoLabsLogo';
import { ProgressIndicator } from './components/ProgressIndicator';
import { Step1AboutYou } from './components/Step1AboutYou';
import { Step2Experience } from './components/Step2Experience';
import { Step3Feedback } from './components/Step3Feedback';
import { Step4Testimonial } from './components/Step4Testimonial';
import { Step5Referrals } from './components/Step5Referrals';
import { Step6Review } from './components/Step6Review';
import { SuccessScreen } from './components/SuccessScreen';
import {
  ClientInfo,
  Ratings,
  FeedbackData,
  TestimonialData,
  ReferralEntry,
  FormStep,
  FeedbackSubmission,
} from './types';
import { submitFeedback, saveDraft, loadDraft, clearDraft } from './services/feedbackService';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface FormStateDraft {
  step: FormStep;
  highestStepReached: FormStep;
  client: ClientInfo;
  ratings: Ratings;
  feedback: FeedbackData;
  testimonial: TestimonialData;
  referrals: ReferralEntry[];
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [highestStepReached, setHighestStepReached] = useState<FormStep>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<FeedbackSubmission | null>(null);

  // Form State
  const [client, setClient] = useState<ClientInfo>({
    name: '',
    company: '',
    email: '',
  });

  const [ratings, setRatings] = useState<Ratings>({
    overall: 0,
    quality: 0,
    communication: 0,
    timeliness: 0,
    value: 0,
  });

  const [feedback, setFeedback] = useState<FeedbackData>({
    liked: '',
    improvements: '',
    recommendation: '',
  });

  const [testimonial, setTestimonial] = useState<TestimonialData>({
    text: '',
    permission: false,
  });

  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // Load draft from IndexedDB on initial mount
  useEffect(() => {
    let isMounted = true;
    async function restoreDraft() {
      try {
        const saved = await loadDraft<FormStateDraft>();
        if (saved && isMounted) {
          if (saved.client) setClient(saved.client);
          if (saved.ratings) setRatings(saved.ratings);
          if (saved.feedback) setFeedback(saved.feedback);
          if (saved.testimonial) setTestimonial(saved.testimonial);
          if (Array.isArray(saved.referrals)) setReferrals(saved.referrals);
          if (saved.highestStepReached) setHighestStepReached(saved.highestStepReached);
          if (saved.step && saved.step <= 6) setCurrentStep(saved.step);
        }
      } catch (err) {
        console.warn('Draft restoration error:', err);
      } finally {
        if (isMounted) {
          setIsDraftLoaded(true);
        }
      }
    }

    restoreDraft();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-save draft to IndexedDB on state change (only after initial load has finished)
  useEffect(() => {
    if (isDraftLoaded && !isSubmitted) {
      saveDraft({
        step: currentStep,
        highestStepReached,
        client,
        ratings,
        feedback,
        testimonial,
        referrals,
      });
    }
  }, [
    isDraftLoaded,
    currentStep,
    highestStepReached,
    client,
    ratings,
    feedback,
    testimonial,
    referrals,
    isSubmitted,
  ]);

  const handleNext = () => {
    const nextStep = (currentStep + 1) as FormStep;
    setCurrentStep(nextStep);
    setHighestStepReached((prev) => (nextStep > prev ? nextStep : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepJump = (step: FormStep) => {
    if (step <= highestStepReached) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Referral manipulation
  const handleAddReferral = () => {
    const newReferral: ReferralEntry = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: '',
      company: '',
      phone: '',
      service: '',
    };
    setReferrals((prev) => [...prev, newReferral]);
  };

  const handleRemoveReferral = (id: string) => {
    setReferrals((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateReferral = (
    id: string,
    field: keyof Omit<ReferralEntry, 'id'>,
    value: string
  ) => {
    setReferrals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Final submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const validReferrals = referrals
      .filter((r) => r.name.trim() || r.company.trim() || r.phone.trim() || r.service.trim())
      .map(({ name, company, phone, service }) => ({
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        service: service.trim(),
      }));

    const submissionPayload: FeedbackSubmission = {
      client: {
        name: client.name.trim(),
        company: client.company.trim(),
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
        permission: testimonial.permission,
      },
      referrals: validReferrals,
      submittedAt: new Date().toISOString(),
    };

    try {
      await submitFeedback(submissionPayload);
      setSubmissionResult(submissionPayload);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Submission failed', error);
      alert('There was an issue submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    clearDraft();
    setClient({ name: '', company: '', email: '' });
    setRatings({ overall: 0, quality: 0, communication: 0, timeliness: 0, value: 0 });
    setFeedback({ liked: '', improvements: '', recommendation: '' });
    setTestimonial({ text: '', permission: false });
    setReferrals([]);
    setCurrentStep(1);
    setHighestStepReached(1);
    setIsSubmitted(false);
    setSubmissionResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 flex flex-col justify-between selection:bg-slate-900 selection:text-white relative overflow-x-hidden">
      {/* Subtle ambient lighting glows matching Professional Polish */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-slate-200/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-slate-200/40 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -z-10" />

      {/* Top Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <a
            href="https://www.magolabs.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg p-1"
          >
            <MagoLabsLogo size="md" />
          </a>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              Secure Submission
            </span>
            <a
              href="https://www.magolabs.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>magolabs.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!isSubmitted ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Top Header Card matching Professional Polish theme */}
            <div className="bg-white rounded-[32px] border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                <span>EST. TIME: 2 MIN</span>
                <span>•</span>
                <span>MAGO LABS CLIENT FEEDBACK</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                We&apos;d Love To Hear From You
              </h1>
              <div className="max-w-xl mx-auto space-y-1.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                <p>
                  Your feedback helps us understand what we&apos;re doing well, where we can improve, and how we can create an even better experience for our clients.
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Thank you for taking a few minutes to share your experience.
                </p>
              </div>
            </div>

            {/* Stepper Progress Indicator */}
            <ProgressIndicator
              currentStep={currentStep}
              onStepClick={handleStepJump}
              highestStepReached={highestStepReached}
            />

            {/* Step Card Container */}
            <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-xs p-6 sm:p-10 relative overflow-hidden transition-all duration-300">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {currentStep === 1 && (
                    <Step1AboutYou
                      data={client}
                      onUpdate={(data) => setClient((prev) => ({ ...prev, ...data }))}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 2 && (
                    <Step2Experience
                      ratings={ratings}
                      onUpdate={(newRatings) => setRatings((prev) => ({ ...prev, ...newRatings }))}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}

                  {currentStep === 3 && (
                    <Step3Feedback
                      data={feedback}
                      onUpdate={(data) => setFeedback((prev) => ({ ...prev, ...data }))}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}

                  {currentStep === 4 && (
                    <Step4Testimonial
                      data={testimonial}
                      onUpdate={(data) => setTestimonial((prev) => ({ ...prev, ...data }))}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}

                  {currentStep === 5 && (
                    <Step5Referrals
                      referrals={referrals}
                      onAddReferral={handleAddReferral}
                      onRemoveReferral={handleRemoveReferral}
                      onUpdateReferral={handleUpdateReferral}
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
                      onEditStep={handleStepJump}
                      onBack={handleBack}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-xs p-6 sm:p-10 my-4">
            <SuccessScreen
              submissionData={submissionResult}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-8 mt-12 text-slate-500 text-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MagoLabsLogo size="sm" />
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Client Feedback Portal</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://www.magolabs.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors font-medium"
            >
              Official Website
            </a>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-mono">
              feedback.magolabs.in
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

