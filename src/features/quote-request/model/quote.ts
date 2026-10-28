import type { ServiceSlug } from "@/shared/config";

/** Plain service fields the client form needs; a `Service` holds an icon component, so it is not passed whole. */
export interface QuoteServiceOption {
  slug: ServiceSlug;
  name: string;
  shortName: string;
}

export const OTHER_SERVICE = { value: "other", label: "Other or not sure yet" } as const;

export const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export interface QuoteValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: ServiceSlug | typeof OTHER_SERVICE.value | "";
  location: string;
  contactMethod: (typeof CONTACT_METHODS)[number]["value"] | "";
  brief: string;
  consent: boolean;
  /** Spam trap hidden from people; sent as `_gotcha` so the form service can drop bot posts. */
  honeypot: string;
}

export type QuoteField = Exclude<keyof QuoteValues, "honeypot">;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

/** Field order on screen; the first invalid field in this order receives focus. */
export const FIELD_ORDER: readonly QuoteField[] = [
  "name",
  "company",
  "email",
  "phone",
  "service",
  "location",
  "brief",
  "contactMethod",
  "consent",
];

export const BRIEF_MIN = 20;
/** Keeps the email fallback within the URL length most mail apps accept. */
export const BRIEF_MAX = 2000;

export const emptyQuote: QuoteValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  location: "",
  contactMethod: "",
  brief: "",
  consent: false,
  honeypot: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/;

/** Error message for one field, or `undefined` when it is valid. Company, location and contact method are optional. */
export function validateField(field: QuoteField, values: QuoteValues): string | undefined {
  switch (field) {
    case "name":
      return values.name.trim().length < 2 ? "Enter your full name." : undefined;
    case "email": {
      const email = values.email.trim();
      if (!email) return "Enter your email address.";
      return EMAIL_PATTERN.test(email) ? undefined : "Enter an email address in the format name@example.com.";
    }
    case "phone": {
      const phone = values.phone.trim();
      if (!phone) return "Enter a phone number so we can reach you.";
      const digits = phone.replace(/\D/g, "").length;
      return PHONE_PATTERN.test(phone) && digits >= 7 && digits <= 15
        ? undefined
        : "Enter a phone number with 7 to 15 digits. Spaces, brackets, dashes and a leading + are fine.";
    }
    case "service":
      return values.service ? undefined : `Choose the service you need, or “${OTHER_SERVICE.label}”.`;
    case "brief": {
      const length = values.brief.trim().length;
      if (length === 0) return "Describe your project.";
      return length < BRIEF_MIN ? `Add a little more detail: at least ${BRIEF_MIN} characters.` : undefined;
    }
    case "consent":
      return values.consent ? undefined : "Confirm that FMECC may use these details to respond to your request.";
    default:
      return undefined;
  }
}

export function validateQuote(values: QuoteValues): QuoteErrors {
  const errors: QuoteErrors = {};
  for (const field of FIELD_ORDER) {
    const error = validateField(field, values);
    if (error) errors[field] = error;
  }
  return errors;
}
