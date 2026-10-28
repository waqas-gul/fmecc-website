export interface SiteConfig {
  name: "FMECC";
  legalName: "Future Middle East Construction Company";
  url: string;
  locale: "en";
  tagline: string;
  description: string;
  contact: {
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    address: string | null;
    hours: string | null;
    mapsUrl: string | null;
  };
  social: { linkedin: string | null; instagram: string | null; x: string | null };
  formEndpoint: string | null;
  analyticsId: string | null;
}

const fromEnv = (value: string | undefined) => (value?.trim() ? value.trim() : null);

/** Site-wide facts. `null` means FMECC has not supplied the value yet, and the UI omits it. */
export const site: SiteConfig = {
  name: "FMECC",
  legalName: "Future Middle East Construction Company",
  url: (fromEnv(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/+$/, ""),
  locale: "en",
  tagline: "Building, telecom, security and access-control infrastructure.",
  description:
    "FMECC delivers building construction, telecom tower rollout, security system installation and maintenance, and hydraulic parking bollard installation.",
  // TODO(content): FMECC supplies phone, WhatsApp, email, office address, hours and Google Maps link
  // (planning/MASTER_PLAN.md §13). Never fill these with sample values. Each one appears wherever
  // contact details are shown (header, menu, footer, CTA band, contact page, form, structured data)
  // as soon as it is set. Formats, checked at build time:
  // - whatsapp: international format with the country code, "+<country code> <number>";
  // - phone: international format preferred; spaces, brackets and dashes are fine;
  // - email: one plain address; mapsUrl: an https:// Google Maps share link;
  // - address and hours: plain text; "\n" starts a new line.
  contact: { phone: null, whatsapp: null, email: null, address: null, hours: null, mapsUrl: null },
  social: { linkedin: null, instagram: null, x: null },
  formEndpoint: fromEnv(process.env.NEXT_PUBLIC_FORM_ENDPOINT),
  analyticsId: fromEnv(process.env.NEXT_PUBLIC_ANALYTICS_ID),
};

export interface ContactLink {
  kind: "phone" | "whatsapp" | "email";
  label: string;
  value: string;
  href: `tel:${string}` | `mailto:${string}` | `https://${string}`;
}

const links: ContactLink[] = [];
const { phone, whatsapp, email } = site.contact;
if (phone) links.push({ kind: "phone", label: "Call", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` });
if (whatsapp) {
  links.push({ kind: "whatsapp", label: "WhatsApp", value: whatsapp, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}` });
}
if (email) links.push({ kind: "email", label: "Email", value: email, href: `mailto:${email}` });

/** Direct contact channels that exist in `site.contact`, in display order. */
export const contactLinks: readonly ContactLink[] = links;

const digitCount = (value: string) => value.replace(/\D/g, "").length;

/**
 * Build-time check of the supplied contact details, so a mistyped value stops the build instead of
 * shipping as a broken `tel:`, `wa.me` or `mailto:` link.
 */
function contactProblems({ phone, whatsapp, email, mapsUrl }: SiteConfig["contact"]): string[] {
  const problems: string[] = [];
  if (phone && !(/^\+?[\d\s().-]+$/.test(phone) && digitCount(phone) >= 7 && digitCount(phone) <= 15)) {
    problems.push(`phone "${phone}": use digits with an optional leading +, 7 to 15 digits in all.`);
  }
  if (whatsapp && !(/^\+[\d\s().-]+$/.test(whatsapp) && digitCount(whatsapp) >= 8 && digitCount(whatsapp) <= 15)) {
    problems.push(`whatsapp "${whatsapp}": use international format with the country code, "+<country code> <number>".`);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) problems.push(`email "${email}" is not a valid address.`);
  if (mapsUrl && !mapsUrl.startsWith("https://")) problems.push(`mapsUrl "${mapsUrl}" must start with https://.`);
  return problems;
}

const problems = contactProblems(site.contact);
if (problems.length > 0) {
  throw new Error(`[site] Fix the contact details in src/shared/config/site.ts:\n  - ${problems.join("\n  - ")}`);
}
