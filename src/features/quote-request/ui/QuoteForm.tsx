"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CircleAlert, CircleCheck, Copy, Info, Mail } from "lucide-react";

import { SERVICE_SLUGS, type ContactLink, type ServiceSlug } from "@/shared/config";
import { Button, Checkbox, Eyebrow, FormField, Input, LinkButton, Select, Textarea } from "@/shared/ui";

import { mailtoHref, postQuote, quoteLabels, quotePayload, quoteSubject, quoteText } from "../lib/delivery";
import {
  BRIEF_MAX,
  CONTACT_METHODS,
  emptyQuote,
  FIELD_ORDER,
  OTHER_SERVICE,
  validateField,
  validateQuote,
  type QuoteErrors,
  type QuoteField,
  type QuoteServiceOption,
  type QuoteValues,
} from "../model/quote";

type Status = "idle" | "submitting" | "sent" | "handoff" | "failed";

const SEND_TIMEOUT_MS = 15_000;

// TODO(content): FMECC to confirm the privacy line; link /privacy/ here once that page exists.
const PRIVACY_NOTE = "FMECC uses these details only to respond to your request.";

const isServiceSlug = (value: string | null): value is ServiceSlug =>
  SERVICE_SLUGS.some((slug) => slug === value);

/**
 * Applies `?service=<slug>` once the query is known. It sits in its own Suspense boundary and renders
 * nothing, so the form itself stays in the prerendered HTML (planning/ARCHITECTURE.md §9).
 */
function ServiceFromQuery({ onService }: { onService: (slug: ServiceSlug) => void }) {
  const requested = useSearchParams().get("service");
  useEffect(() => {
    if (isServiceSlug(requested)) onService(requested);
  }, [requested, onService]);
  return null;
}

function DirectLinks({ channels }: { channels: readonly ContactLink[] }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1">
      {channels.map((link) => (
        <li key={link.kind}>
          <a
            href={link.href}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-body-sm text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            <span className="type-label text-highlight">{link.label}</span>
            {link.value}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Quotation form (planning/MASTER_PLAN.md §7). Delivery depends on configuration: POST to the form
 * endpoint; without one, hand the request to the visitor's email app and say plainly that it is not
 * sent yet; with neither, the form is shown disabled with an explanation.
 */
export function QuoteForm({
  id,
  defaultService,
  services,
  endpoint,
  email,
  channels,
}: {
  id: string;
  defaultService?: ServiceSlug;
  services: readonly QuoteServiceOption[];
  endpoint: string | null;
  email: string | null;
  channels: readonly ContactLink[];
}) {
  const delivery = endpoint ? "endpoint" : email ? "email" : "unavailable";
  const [values, setValues] = useState<QuoteValues>(() => ({ ...emptyQuote, service: defaultService ?? "" }));
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [announcement, setAnnouncement] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const outcomeRef = useRef<HTMLHeadingElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  const fieldId = (field: string) => `${id}-${field}`;
  const labels = quoteLabels(values, services);
  const text = quoteText(values, labels);
  const mailto = email ? mailtoHref(email, quoteSubject(values, labels), text) : null;
  const errorCount = FIELD_ORDER.filter((field) => errors[field]).length;

  useEffect(() => () => requestRef.current?.abort(), []);

  // Move focus to the outcome so keyboard and screen reader users land on it.
  useEffect(() => {
    if (status === "sent" || status === "handoff" || status === "failed") outcomeRef.current?.focus();
  }, [status]);

  const applyQueryService = useCallback((slug: ServiceSlug) => setValues((current) => ({ ...current, service: slug })), []);

  function focusField(field: QuoteField) {
    const element = formRef.current?.elements.namedItem(field);
    if (element instanceof HTMLElement) element.focus();
  }

  function setField<K extends keyof QuoteValues>(field: K, value: QuoteValues[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    setCopied(false);
    // A field that shows an error is re-checked as it changes, so the message clears once it is fixed.
    const name = field as QuoteField;
    if (field !== "honeypot" && errors[name]) setErrors((current) => ({ ...current, [name]: validateField(name, next) }));
  }

  // Before the first submit, leaving an empty field is not an error yet.
  function checkField(field: QuoteField) {
    const value = values[field];
    const empty = typeof value === "string" ? value.trim() === "" : !value;
    if (empty && !attempted) return;
    setErrors((current) => ({ ...current, [field]: validateField(field, values) }));
  }

  function backToForm(reset: boolean) {
    flushSync(() => {
      if (reset) {
        setValues((current) => ({ ...emptyQuote, service: current.service }));
        setErrors({});
        setAttempted(false);
      }
      setStatus("idle");
      setAnnouncement("");
    });
    focusField("name");
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setAnnouncement("Request copied.");
    } catch {
      setAnnouncement("Copying is not available here. Open “Show the request text” and copy it from there.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (delivery === "unavailable" || status === "submitting") return;

    const found = validateQuote(values);
    const invalid = FIELD_ORDER.filter((field) => found[field]);
    // Render the messages before moving focus, so the focused field announces its own error.
    flushSync(() => {
      setAttempted(true);
      setErrors(found);
    });
    if (invalid.length > 0) {
      setAnnouncement(invalid.length === 1 ? "One field needs attention." : `${invalid.length} fields need attention.`);
      focusField(invalid[0]);
      return;
    }

    if (!endpoint) {
      // Email fallback: nothing is sent from here, so this is a hand-off, never a success.
      if (!mailto) return;
      window.location.href = mailto;
      setAnnouncement("");
      setStatus("handoff");
      return;
    }

    setStatus("submitting");
    setAnnouncement("Sending your request.");
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
    let accepted = false;
    try {
      accepted = await postQuote(endpoint, quotePayload(values, labels), controller.signal);
    } catch {
      accepted = false;
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
    }
    setAnnouncement("");
    setStatus(accepted ? "sent" : "failed");
  }

  const firstName = values.name.trim().split(/\s+/)[0];
  const outcomeHeading = "font-display text-heading-md font-semibold outline-none";

  return (
    <section
      id={id}
      aria-labelledby={fieldId("title")}
      data-delivery={delivery}
      className="rounded-lg border border-line bg-surface-raised p-6 sm:p-8 lg:p-10"
    >
      <Suspense fallback={null}>
        <ServiceFromQuery onService={applyQueryService} />
      </Suspense>
      <p role="status" className="sr-only">
        {announcement}
      </p>

      <Eyebrow>Quotation request</Eyebrow>
      <h2 id={fieldId("title")} className="mt-5 font-display text-heading-md font-semibold">
        Request a quotation
      </h2>

      {status === "sent" ? (
        <div className="mt-8 flex flex-col items-start gap-5 border-t border-line pt-8">
          <CircleCheck aria-hidden className="size-9 text-highlight" />
          <h3 ref={outcomeRef} tabIndex={-1} className={outcomeHeading}>
            Request sent
          </h3>
          <p className="max-w-[55ch] text-body text-ink-muted">
            Thank you{firstName ? `, ${firstName}` : ""}. Your quotation request has been sent to FMECC. We will
            review it and contact you using the details you provided.
          </p>
          {channels.length > 0 && (
            <div>
              <p className="type-label text-ink-subtle">Need to reach us sooner?</p>
              <div className="mt-2">
                <DirectLinks channels={channels} />
              </div>
            </div>
          )}
          <Button variant="outline" onClick={() => backToForm(true)}>
            Send another request
          </Button>
        </div>
      ) : status === "handoff" && mailto ? (
        <div className="mt-8 flex flex-col items-start gap-5 border-t border-line pt-8">
          <Mail aria-hidden className="size-9 text-highlight" />
          <h3 ref={outcomeRef} tabIndex={-1} className={outcomeHeading}>
            Finish sending in your email app
          </h3>
          <p className="max-w-[60ch] text-body text-ink-muted">
            Your email app should now show a message to <span className="font-medium text-ink">{email}</span> with your
            request filled in.{" "}
            <strong className="font-semibold text-ink">Your request has not been sent yet:</strong> it reaches FMECC only
            when you press Send in that email.
          </p>
          <p className="max-w-[60ch] text-body text-ink-muted">
            If no email window opened, copy the request and send it to{" "}
            <a href={`mailto:${email}`} className="font-medium text-accent-text underline underline-offset-4">
              {email}
            </a>{" "}
            from any email account.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={mailto} icon={<Mail />}>
              Open the email again
            </LinkButton>
            <Button variant="outline" icon={<Copy />} iconPosition="start" onClick={copyRequest}>
              {copied ? "Copied" : "Copy request"}
            </Button>
            <Button variant="ghost" onClick={() => backToForm(false)}>
              Edit request
            </Button>
          </div>
          <details className="w-full">
            <summary className="type-label inline-flex min-h-11 cursor-pointer items-center rounded-sm text-ink-muted hover:text-ink">
              Show the request text
            </summary>
            <pre className="mt-3 max-h-80 overflow-auto rounded-md border border-line bg-surface-muted p-4 font-mono text-body-sm whitespace-pre-wrap text-ink">
              {text}
            </pre>
          </details>
        </div>
      ) : (
        <>
          <p className="mt-3 max-w-[60ch] text-body text-ink-muted">
            Tell us what you need, where and when. Fields marked * are required.
          </p>

          <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-8">
            {delivery === "unavailable" && (
              <p
                id={fieldId("delivery")}
                className="mb-8 flex gap-3 rounded-md border border-line-strong bg-surface-muted p-4 text-body-sm text-ink"
              >
                <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-highlight" />
                <span>
                  Online quotation requests are not connected yet, so this form cannot be sent.
                  {channels.length > 0 && " Please contact FMECC directly using the details on this page."}
                </span>
              </p>
            )}

            <fieldset disabled={delivery === "unavailable"} className="min-w-0">
              <legend className="sr-only">Your details and your project</legend>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Full name" htmlFor={fieldId("name")} error={errors.name} required>
                  <Input
                    name="name"
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    maxLength={100}
                    value={values.name}
                    onChange={(event) => setField("name", event.target.value)}
                    onBlur={() => checkField("name")}
                  />
                </FormField>
                <FormField label="Company" htmlFor={fieldId("company")} error={errors.company}>
                  <Input
                    name="company"
                    autoComplete="organization"
                    enterKeyHint="next"
                    maxLength={120}
                    value={values.company}
                    onChange={(event) => setField("company", event.target.value)}
                  />
                </FormField>
                <FormField label="Email" htmlFor={fieldId("email")} error={errors.email} required>
                  <Input
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="next"
                    maxLength={254}
                    value={values.email}
                    onChange={(event) => setField("email", event.target.value)}
                    onBlur={() => checkField("email")}
                  />
                </FormField>
                <FormField label="Phone" htmlFor={fieldId("phone")} error={errors.phone} required>
                  <Input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    maxLength={30}
                    value={values.phone}
                    onChange={(event) => setField("phone", event.target.value)}
                    onBlur={() => checkField("phone")}
                  />
                </FormField>
                <FormField label="Service" htmlFor={fieldId("service")} error={errors.service} required>
                  <Select
                    name="service"
                    value={values.service}
                    onChange={(event) => setField("service", event.target.value as QuoteValues["service"])}
                    onBlur={() => checkField("service")}
                  >
                    <option value="" disabled>
                      Choose a service
                    </option>
                    {services.map((service) => (
                      <option key={service.slug} value={service.slug}>
                        {service.shortName}
                      </option>
                    ))}
                    <option value={OTHER_SERVICE.value}>{OTHER_SERVICE.label}</option>
                  </Select>
                </FormField>
                <FormField label="Project location" htmlFor={fieldId("location")}>
                  <Input
                    name="location"
                    placeholder="City or area, if known"
                    autoComplete="off"
                    enterKeyHint="next"
                    maxLength={120}
                    value={values.location}
                    onChange={(event) => setField("location", event.target.value)}
                  />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField
                    label="Project description"
                    htmlFor={fieldId("brief")}
                    hint="The site, the scope of work, the timing, and anything already designed or approved."
                    error={errors.brief}
                    required
                  >
                    <Textarea
                      name="brief"
                      rows={6}
                      maxLength={BRIEF_MAX}
                      value={values.brief}
                      onChange={(event) => setField("brief", event.target.value)}
                      onBlur={() => checkField("brief")}
                    />
                  </FormField>
                </div>
                <FormField label="Preferred contact method" htmlFor={fieldId("contactMethod")}>
                  <Select
                    name="contactMethod"
                    value={values.contactMethod}
                    onChange={(event) => setField("contactMethod", event.target.value as QuoteValues["contactMethod"])}
                  >
                    <option value="">No preference</option>
                    {CONTACT_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Use of your details" htmlFor={fieldId("consent")} error={errors.consent} required>
                    <Checkbox
                      name="consent"
                      checked={values.consent}
                      onChange={(event) => setField("consent", event.target.checked)}
                      onBlur={() => checkField("consent")}
                      label="I agree that FMECC may use these details to respond to this request."
                    />
                  </FormField>
                </div>
              </div>

              {/* Honeypot: inert and visually hidden, so only bots fill it in. */}
              <div inert className="sr-only">
                <label htmlFor={fieldId("website")}>Leave this field empty</label>
                <input
                  id={fieldId("website")}
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.honeypot}
                  onChange={(event) => setField("honeypot", event.target.value)}
                />
              </div>

              {status === "failed" && (
                <div className="mt-8 rounded-md border border-danger p-5">
                  <h3
                    ref={outcomeRef}
                    tabIndex={-1}
                    className="flex items-center gap-2 font-display text-heading-sm font-semibold text-danger outline-none"
                  >
                    <CircleAlert aria-hidden className="size-5 shrink-0" />
                    Your request could not be sent
                  </h3>
                  <p className="mt-2 text-body-sm text-ink-muted">
                    Something went wrong while sending, and we could not confirm delivery. Your details are still filled
                    in, so you can try again{mailto ? " or send the same request by email" : ""}.
                  </p>
                  {(mailto || channels.length > 0) && (
                    <div className="mt-3 flex flex-col items-start gap-1">
                      {mailto && (
                        <LinkButton href={mailto} variant="link" icon={<Mail />} iconPosition="start" className="min-h-11">
                          Email the request instead
                        </LinkButton>
                      )}
                      {channels.length > 0 && <DirectLinks channels={channels} />}
                    </div>
                  )}
                </div>
              )}

              {delivery === "email" && (
                <p
                  id={fieldId("delivery")}
                  className="mt-8 flex gap-3 rounded-md border border-line bg-surface-muted p-4 text-body-sm text-ink-muted"
                >
                  <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-highlight" />
                  <span>
                    Sending opens your email app with this request filled in. It reaches FMECC only when you send that
                    email.
                  </span>
                </p>
              )}

              <div className="mt-8 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3">
                  {errorCount > 0 && (
                    <p className="flex items-start gap-2 text-body-sm font-medium text-danger">
                      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                      {errorCount === 1 ? "Correct the field marked above." : `Correct the ${errorCount} fields marked above.`}
                    </p>
                  )}
                  <p className="max-w-[42ch] text-body-sm text-ink-subtle">{PRIVACY_NOTE}</p>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  loading={status === "submitting"}
                  icon={delivery === "email" ? <Mail /> : <ArrowRight />}
                  aria-describedby={delivery === "endpoint" ? undefined : fieldId("delivery")}
                  className="max-sm:w-full"
                >
                  {delivery === "email" ? "Continue in email app" : status === "submitting" ? "Sending…" : "Send request"}
                </Button>
              </div>
            </fieldset>
          </form>
        </>
      )}
    </section>
  );
}
