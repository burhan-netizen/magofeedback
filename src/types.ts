export interface ClientInfo {
  name: string;
  company: string;
  email: string;
}

export interface Ratings {
  overall: number;
  quality: number;
  communication: number;
  timeliness: number;
  value: number;
}

export type RecommendationOption = 'Definitely' | 'Probably' | 'Not Sure' | 'Probably Not' | '';

export interface FeedbackData {
  liked: string;
  improvements: string;
  recommendation: RecommendationOption;
}

export interface TestimonialData {
  text: string;
  permission: boolean;
}

export interface ReferralEntry {
  id: string;
  name: string;
  company: string;
  phone: string;
  service: string;
}

export interface FeedbackSubmission {
  client: {
    name: string;
    company: string;
    email: string;
  };
  ratings: {
    overall: number;
    quality: number;
    communication: number;
    timeliness: number;
    value: number;
  };
  feedback: {
    liked: string;
    improvements: string;
    recommendation: RecommendationOption;
  };
  testimonial: {
    text: string;
    permission: boolean;
  };
  referrals: Array<{
    name: string;
    company: string;
    phone: string;
    service: string;
  }>;
  submittedAt?: string;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface StepValidationErrors {
  name?: string;
  email?: string;
  ratings?: {
    overall?: string;
    quality?: string;
    communication?: string;
    timeliness?: string;
    value?: string;
  };
  recommendation?: string;
}
