import React, { useState } from 'react';
import { ClientInfo } from '../types';
import { OptionalTag, StepHeader, StepNav } from './ui';

interface Step1Props {
  data: ClientInfo;
  onUpdate: (data: Partial<ClientInfo>) => void;
  onNext: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const Step1AboutYou: React.FC<Step1Props> = ({ data, onUpdate, onNext }) => {
  const [tried, setTried] = useState(false);

  const errors = {
    name: !data.name.trim() ? 'Please tell us your name.' : '',
    email: !data.email.trim()
      ? 'Please add your email so we can thank you properly.'
      : !EMAIL_RE.test(data.email.trim())
      ? 'That email does not look quite right.'
      : '',
  };
  const valid = !errors.name && !errors.email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (valid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader
        eyebrow="Step 01 / About you"
        title="First, who are we hearing from?"
        intro="Just the basics, so we know who to thank."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="client-name" className="ml-label">
            Your name
          </label>
          <input
            id="client-name"
            className="ml-input"
            autoComplete="name"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g. Alex Morgan"
            aria-invalid={tried && !!errors.name}
          />
          {tried && errors.name && <p className="ml-error">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="client-company" className="ml-label">
            Business name
          </label>
          <input
            id="client-company"
            className="ml-input"
            autoComplete="organization"
            value={data.company}
            onChange={(e) => onUpdate({ company: e.target.value })}
            placeholder="e.g. Morgan Builders"
          />
        </div>

        <div>
          <label htmlFor="client-role" className="ml-label">
            Your role
            <OptionalTag />
          </label>
          <input
            id="client-role"
            className="ml-input"
            autoComplete="organization-title"
            value={data.role}
            onChange={(e) => onUpdate({ role: e.target.value })}
            placeholder="e.g. Founder, Owner, Director"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="client-email" className="ml-label">
            Email
          </label>
          <input
            id="client-email"
            type="email"
            inputMode="email"
            className="ml-input"
            autoComplete="email"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="you@yourbusiness.com"
            aria-invalid={tried && !!errors.email}
          />
          {tried && errors.email ? (
            <p className="ml-error">{errors.email}</p>
          ) : (
            <p className="ml-hint">Only used to reply to you. Never shared, never added to a mailing list.</p>
          )}
        </div>
      </div>

      <StepNav continueLabel="Let's start" />
    </form>
  );
};
