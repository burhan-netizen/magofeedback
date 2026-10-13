import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { FeedbackSubmission } from '../types';

export const GOOGLE_REVIEW_URL = 'https://g.page/r/CXyj1A87sv2BEBM/review';
const SITE_URL = 'https://www.magolabs.in';

interface SuccessScreenProps {
  submission: FeedbackSubmission | null;
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ submission, onReset }) => {
  const [copied, setCopied] = useState(false);
  const overall = submission?.ratings.overall ?? 0;
  const happy = overall >= 4;
  const firstName = submission?.client.name.trim().split(/\s+/)[0] || '';
  const reviewText = (submission?.testimonial.text || submission?.feedback.liked || '').trim();
  const referralCount = submission?.referrals.length ?? 0;

  useEffect(() => {
    if (!happy) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const colors = ['#FFC53D', '#0D0D0D', '#E4E1D9'];
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.35 }, colors, disableForReducedMotion: true });
  }, [happy]);

  const copyReview = async () => {
    if (!reviewText) return;
    try {
      await navigator.clipboard.writeText(reviewText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = reviewText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareMessage = `I worked with Mago Labs on my website and would recommend them. Worth a look: ${SITE_URL}`;
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mago Labs', text: shareMessage, url: SITE_URL });
        return;
      } catch {
        /* cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank', 'noopener');
  };

  const ReviewBlock = (
    <div className={`rounded-3xl p-6 sm:p-8 text-left ${happy ? 'bg-ink text-paper' : 'border border-hairline bg-white'}`}>
      <p className={`ml-eyebrow ${happy ? 'text-soft' : ''}`}>{happy ? 'One last favour / 30 seconds' : 'Optional'}</p>
      <h2 className={`mt-3 text-[24px] sm:text-[28px] leading-tight font-bold ${happy ? 'text-paper' : 'text-ink'}`}>
        {happy ? (
          <>
            Would you say the same on <span className="ml-mark text-ink">Google?</span>
          </>
        ) : (
          'You can also leave a public review on Google.'
        )}
      </h2>
      {happy && (
        <p className="mt-3 text-[15px] leading-relaxed text-soft">
          A Google review is how the next business owner finds us and decides to trust us. It helps a small studio
          more than almost anything else.
        </p>
      )}

      <ol className="mt-6 space-y-4">
        {reviewText && (
          <li className="flex gap-4">
            <span className={`font-mono text-[12px] font-bold mt-1 ${happy ? 'text-signal' : 'text-muted'}`}>01</span>
            <div className="flex-1 min-w-0">
              <p className={`text-[15px] font-semibold ${happy ? 'text-paper' : 'text-ink'}`}>Copy what you already wrote</p>
              <p
                className={`mt-2 text-[14px] italic leading-relaxed rounded-xl p-3 max-h-32 overflow-auto ${
                  happy ? 'bg-white/5 text-paper/90' : 'bg-paper text-ink'
                }`}
              >
                "{reviewText}"
              </p>
              <button
                type="button"
                onClick={copyReview}
                className={`mt-3 ${happy ? 'ml-btn-ghost text-paper border-white/20 hover:bg-white/10' : 'ml-btn-ghost'}`}
              >
                {copied ? 'Copied' : 'Copy text'}
              </button>
            </div>
          </li>
        )}
        <li className="flex gap-4">
          <span className={`font-mono text-[12px] font-bold mt-1 ${happy ? 'text-signal' : 'text-muted'}`}>
            {reviewText ? '02' : '01'}
          </span>
          <div className="flex-1">
            <p className={`text-[15px] font-semibold ${happy ? 'text-paper' : 'text-ink'}`}>
              {reviewText ? 'Paste it into Google and pick your stars' : 'Pick your stars and add a line or two'}
            </p>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (reviewText && !copied) copyReview();
              }}
              className={`mt-3 ${happy ? 'ml-btn-signal' : 'ml-btn-primary'}`}
            >
              Leave a Google review <span aria-hidden="true">↗</span>
            </a>
          </div>
        </li>
      </ol>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="ml-eyebrow inline-flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-signal" aria-hidden="true" />
        Received
      </p>
      <h1 className="mt-4 text-[34px] sm:text-[44px] leading-[1.08] font-bold tracking-tight text-ink">
        {happy ? (
          <>
            Thank you{firstName ? `, ${firstName}` : ''}. <br className="hidden sm:block" />
            <span className="ml-mark">That means a lot.</span>
          </>
        ) : (
          <>
            Thank you{firstName ? `, ${firstName}` : ''}, <br className="hidden sm:block" />
            for being honest.
          </>
        )}
      </h1>
      <p className="mt-4 text-[16px] leading-relaxed text-muted max-w-xl mx-auto">
        {happy
          ? 'Your feedback has reached Burhan directly. He reads every single one.'
          : 'Your feedback has reached Burhan directly. He will get in touch personally to talk it through and put things right.'}
        {referralCount > 0 &&
          ` And thank you for introducing ${referralCount === 1 ? 'someone' : `${referralCount} people`}. We will look after them.`}
      </p>

      <div className="mt-10">{ReviewBlock}</div>

      <div className="mt-6 rounded-3xl border border-hairline bg-white p-6 sm:p-8 text-left">
        <p className="ml-eyebrow">Thought of someone later?</p>
        <p className="mt-2 text-[16px] font-semibold text-ink">Send them our way with one tap.</p>
        <p className="mt-1 text-[14px] text-muted">Opens WhatsApp (or your share menu) with a short message ready to send.</p>
        <button type="button" onClick={shareNative} className="ml-btn-ghost mt-4">
          Share Mago Labs
        </button>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="ml-link-btn">
          Visit magolabs.in
        </a>
        <span className="hidden sm:inline text-hairline">/</span>
        <button type="button" onClick={onReset} className="ml-link-btn">
          Submit another response
        </button>
      </div>
    </div>
  );
};
