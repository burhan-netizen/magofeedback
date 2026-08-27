import React, { useState } from 'react';
import { ClientInfo } from '../types';
import { User, Building2, Mail, ArrowRight } from 'lucide-react';

interface Step1Props {
  data: ClientInfo;
  onUpdate: (data: Partial<ClientInfo>) => void;
  onNext: () => void;
}

export const Step1AboutYou: React.FC<Step1Props> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!data.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (data.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'name' | 'email') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'name') {
      if (!data.name.trim()) {
        setErrors((prev) => ({ ...prev, name: 'Please enter your name' }));
      } else {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }
    }
    if (field === 'email' && data.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} id="step-1-form" className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Tell us a little about yourself
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Let us know who we had the pleasure of working with.
        </p>
      </div>

      <div className="space-y-5">
        {/* Name Field */}
        <div>
          <label
            htmlFor="client-name"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Name <span className="text-amber-500" title="Required">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="client-name"
              required
              autoFocus
              value={data.name}
              onChange={(e) => {
                onUpdate({ name: e.target.value });
                if (errors.name && e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Alex Morgan"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 text-slate-900 rounded-xl border text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${
                errors.name && touched.name
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200/60 bg-rose-50/20'
                  : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 hover:border-slate-300'
              }`}
            />
          </div>
          {errors.name && touched.name && (
            <p className="text-xs text-rose-500 font-semibold mt-1.5">
              {errors.name}
            </p>
          )}
        </div>

        {/* Company Field */}
        <div>
          <label
            htmlFor="client-company"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Company
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="client-company"
              value={data.company}
              onChange={(e) => onUpdate({ company: e.target.value })}
              placeholder="e.g. Acme Corp or Studio Design"
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-slate-900 rounded-xl border border-slate-200 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 hover:border-slate-300"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="client-email"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              id="client-email"
              value={data.email}
              onChange={(e) => {
                onUpdate({ email: e.target.value });
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              onBlur={() => handleBlur('email')}
              placeholder="e.g. alex@example.com"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 text-slate-900 rounded-xl border text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white ${
                errors.email && touched.email
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200/60 bg-rose-50/20'
                  : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 hover:border-slate-300'
              }`}
            />
          </div>
          {errors.email && touched.email && (
            <p className="text-xs text-rose-500 font-semibold mt-1.5">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          id="btn-step1-continue"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

