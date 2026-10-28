import { CONTACT_METHODS, OTHER_SERVICE, type QuoteServiceOption, type QuoteValues } from "../model/quote";

/** Human-readable choices, so the email and the form service never show raw slugs. */
export interface QuoteLabels {
  service: string;
  contactMethod: string;
}

export function quoteLabels(values: QuoteValues, services: readonly QuoteServiceOption[]): QuoteLabels {
  const service =
    values.service === OTHER_SERVICE.value
      ? OTHER_SERVICE.label
      : (services.find((option) => option.slug === values.service)?.name ?? "");
  const contactMethod = CONTACT_METHODS.find((method) => method.value === values.contactMethod)?.label ?? "";
  return { service, contactMethod };
}

export function quoteSubject(values: QuoteValues, labels: QuoteLabels): string {
  return `Quotation request: ${labels.service || "General enquiry"} – ${values.name.trim()}`;
}

/** The request as plain text, for the email fallback and the copy button. Empty optional fields are left out. */
export function quoteText(values: QuoteValues, labels: QuoteLabels): string {
  const details = [
    ["Name", values.name],
    ["Company", values.company],
    ["Email", values.email],
    ["Phone", values.phone],
    ["Service", labels.service],
    ["Project location", values.location],
    ["Preferred contact", labels.contactMethod],
  ]
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`);

  return [...details, "", "Project description:", values.brief.trim()].join("\n");
}

export function mailtoHref(email: string, subject: string, body: string): `mailto:${string}` {
  // Mail clients expect CRLF line breaks in a mailto body (RFC 6068).
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, "\r\n"))}`;
}

/** JSON body for a Formspree-compatible endpoint: `email` becomes the reply-to, `_gotcha` is the honeypot. */
export function quotePayload(values: QuoteValues, labels: QuoteLabels) {
  return {
    _subject: quoteSubject(values, labels),
    name: values.name.trim(),
    company: values.company.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    service: labels.service,
    location: values.location.trim(),
    preferredContact: labels.contactMethod,
    message: values.brief.trim(),
    consent: values.consent ? "yes" : "no",
    _gotcha: values.honeypot,
  };
}

const rejected = (body: unknown) =>
  typeof body === "object" &&
  body !== null &&
  (("ok" in body && body.ok === false) || ("success" in body && body.success === false));

/**
 * Posts the request to the configured endpoint. Resolves `true` only when the service accepted it
 * (2xx and no explicit `ok: false` / `success: false`); throws on network failure or abort.
 */
export async function postQuote(endpoint: string, payload: object, signal: AbortSignal): Promise<boolean> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!response.ok) return false;
  const body: unknown = await response.json().catch(() => null);
  return !rejected(body);
}
