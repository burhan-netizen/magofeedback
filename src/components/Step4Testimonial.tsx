import React, { useRef, useState } from 'react';
import { TestimonialData } from '../types';
import { StepHeader, StepNav } from './ui';

interface Step4Props {
  data: TestimonialData;
  liked: string;
  displayName: string;
  onUpdate: (data: Partial<TestimonialData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const MAX_SIDE = 640;

/** Shrinks any image to a small JPEG so it travels comfortably in an email. */
async function compressImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not read that image'));
      el.src = url;
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.fillStyle = '#ffffff'; // logos with transparent backgrounds land on white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const Step4Testimonial: React.FC<Step4Props> = ({ data, liked, displayName, onUpdate, onNext, onBack }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleFile = async (file?: File) => {
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file (JPG, PNG or similar).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPhotoError('That image is very large. Please pick one under 15 MB.');
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await compressImage(file);
      onUpdate({ photo: dataUrl, photoName: file.name });
    } catch {
      setPhotoError('We could not read that image. Try a different one.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader
        eyebrow="Step 04 / Testimonial"
        title={
          <>
            Help the next business owner <span className="ml-mark">decide.</span>
          </>
        }
        intro="Most business owners pick an agency based on what other owners say. A few honest lines from you carry more weight than anything we could write ourselves."
      />

      <div className="space-y-7">
        <div>
          <div className="flex items-end justify-between gap-3">
            <label htmlFor="testimonial-text" className="ml-label">
              Your testimonial
            </label>
            {liked.trim() && !data.text.trim() && (
              <button type="button" className="ml-link-btn mb-1.5" onClick={() => onUpdate({ text: liked.trim() })}>
                Start from what you wrote earlier
              </button>
            )}
          </div>
          <textarea
            id="testimonial-text"
            rows={5}
            className="ml-input resize-y min-h-[140px]"
            value={data.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="What was the problem before, what did we do, and what changed after?"
          />
          <p className="ml-hint">
            Results land best: more enquiries, more calls, a site you are finally proud to share.
          </p>
        </div>

        <div>
          <p className="ml-label">
            Your photo or business logo
          </p>
          <p className="text-[13px] text-muted -mt-0.5 mb-3">Testimonials with a face or logo are trusted far more.</p>

          {data.photo ? (
            <div className="flex items-center gap-4 rounded-2xl border border-hairline bg-paper p-3">
              <img src={data.photo} alt="Your upload" className="w-16 h-16 rounded-xl object-cover bg-white border border-hairline" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-ink truncate">{data.photoName || 'Image added'}</p>
                <div className="flex gap-4 mt-1">
                  <button type="button" className="ml-link-btn" onClick={() => fileRef.current?.click()}>
                    Replace
                  </button>
                  <button type="button" className="ml-link-btn" onClick={() => onUpdate({ photo: '', photoName: '' })}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className="w-full rounded-2xl border border-dashed border-[#cfcbc0] bg-paper hover:bg-white transition-colors px-4 py-6 text-center cursor-pointer"
            >
              <span className="block text-[14px] font-semibold text-ink">{busy ? 'Preparing image...' : 'Add a photo or logo'}</span>
              <span className="block text-[12px] text-muted mt-1">JPG or PNG. Tap to choose, or drop it here.</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {photoError && <p className="ml-error">{photoError}</p>}
        </div>

        {(data.text.trim() || data.photo) && (
          <label className="flex items-start gap-3 rounded-2xl border border-hairline bg-white p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={data.permission}
              onChange={(e) => onUpdate({ permission: e.target.checked })}
              className="mt-1 w-4 h-4 accent-[#0d0d0d] cursor-pointer"
            />
            <span className="text-[14px] leading-relaxed text-ink">
              Mago Labs can show this on its website and social media
              {displayName ? (
                <>
                  , credited to <strong className="font-semibold">{displayName}</strong>
                </>
              ) : null}
              .
              <span className="block text-[12px] text-muted mt-0.5">Untick if you would rather keep it private.</span>
            </span>
          </label>
        )}
      </div>

      <StepNav onBack={onBack} />
    </form>
  );
};
