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
  // TODO(content): confirm the tagline and description with FMECC.
  tagline: "Building, telecom, security and access infrastructure.",
  description:
    "FMECC delivers building construction, telecom tower rollout, security system installation and maintenance, and hydraulic parking bollards.",
  // Supplied by FMECC (MASTER_PLAN.md §13). Never fill these with sample values.
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
