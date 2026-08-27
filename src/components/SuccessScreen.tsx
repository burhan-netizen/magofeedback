import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MagoLabsLogo } from './MagoLabsLogo';
import { CheckCircle, ExternalLink, RotateCcw } from 'lucide-react';
import { FeedbackSubmission } from '../types';

interface SuccessScreenProps {
  submissionData: FeedbackSubmission | null;
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  submissionData,
  onReset,
}) => {
  useEffect(() => {
    // Fire celebratory confetti bursts
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0f172a', '#334155', '#64748b', '#fbbf24', '#f59e0b'],
      });

      const timeout = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 400);

      return () => clearTimeout(timeout);
    } catch {
      // Graceful fallback if canvas is restricted
    }
  }, []);

  return (
    <div id="success-screen" className="text-center py-8 sm:py-12 px-4 sm:px-8 space-y-8 max-w-xl mx-auto">
      {/* Brand logo */}
      <div className="flex justify-center">
        <MagoLabsLogo size="lg" />
      </div>

      {/* Success Badge */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 shadow-xs">
        <CheckCircle className="w-9 h-9 stroke-[2.2]" />
      </div>

      {/* Headings */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Thank You! 🎉
        </h1>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-700">
          Your feedback has been received.
        </h3>
      </div>

      {/* Appreciative text */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-slate-600 text-sm sm:text-base leading-relaxed space-y-4 shadow-xs">
        <p>
          We genuinely appreciate you taking the time to share your experience with Mago Labs.
        </p>
        <p>
          Your feedback helps us grow, improve, and continue delivering better work for our clients.
        </p>
        <p className="font-semibold text-slate-900 pt-2 border-t border-slate-200/60">
          Team Mago Labs
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href="https://www.magolabs.in"
          target="_blank"
          rel="noopener noreferrer"
          id="btn-visit-magolabs"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
        >
          <span>Visit Mago Labs</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <button
          type="button"
          onClick={onReset}
          id="btn-submit-another"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Submit Another Response</span>
        </button>
      </div>

      {/* Submission details helper */}
      {submissionData && (
        <div className="text-xs text-slate-400 pt-4">
          Submission reference ID:{' '}
          <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
            MAGO-{new Date().getTime().toString(36).toUpperCase()}
          </code>
        </div>
      )}
    </div>
  );
};

