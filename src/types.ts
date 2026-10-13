export interface ClientInfo {
  name: string;
  company: string;
  role: string;
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
  /** Compressed JPEG data URL of the client's photo or logo (optional). */
  photo: string;
  photoName: string;
}

export const SERVICE_OPTIONS = [
  'Custom Website',
  'SEO',
  'Google Business Profile',
  'Conversion Copywriting',
  'Not sure yet',
] as const;

export interface ReferralEntry {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  relationship: string;
  services: string[];
  mentionMe: boolean;
}

export interface FeedbackSubmission {
  client: {
    name: string;
    company: string;
    role: string;
    email: string;
  };
  ratings: Ratings;
  feedback: FeedbackData;
  testimonial: {
    text: string;
    permission: boolean;
    photo?: string;
    photoName?: string;
  };
  referrals: Array<Omit<ReferralEntry, 'id'>>;
  submittedAt?: string;
  /** Anti-spam: hidden honeypot field (must stay empty) and form start time. */
  hp?: string;
  startedAt?: number;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;
