import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";

import { ContactChannels } from "@/features/contact-channels";
import { contactLinks, demoContactItems, site, type DemoContactItem } from "@/shared/config";
import { Badge, Eyebrow, IconTile, LinkButton } from "@/shared/ui";

// TODO(content): FMECC to confirm how enquiries are handled before these steps go live.
const NEXT_STEPS = [
  { title: "We review your request", description: "We read the scope, the location and the timing you describe." },
  { title: "We contact you", description: "We get in touch to clarify details and, where needed, arrange a site visit." },
  { title: "You receive a quotation", description: "We prepare a quotation for the scope we have agreed with you." },
];

const isWebUrl = (url: string): url is `http${string}` => /^https?:\/\//.test(url);

const demoIcons: Record<DemoContactItem["kind"], LucideIcon> = {
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  address: MapPin,
  hours: Clock,
};

/**
 * Direct contact beside the quotation form (planning/DESIGN.md §9.3): channels, office and hours.
 * Only details FMECC has supplied in `site.contact` render; nothing is filled in with sample values.
 */
export function ContactPanel() {
  const { address, hours, mapsUrl } = site.contact;
  const hasDetails = contactLinks.length > 0 || Boolean(address) || Boolean(hours);
  // TEMPORARY preview: sample details on show and the form in demo mode (no endpoint yet).
  const preview = demoContactItems.length > 0 && !site.formEndpoint;

  return (
    <aside aria-labelledby="contact-panel-title" className="flex flex-col gap-10">
      <div>
        <Eyebrow>Direct contact</Eyebrow>
        <h2 id="contact-panel-title" className="mt-5 font-display text-heading-md font-semibold">
          Talk to the team
        </h2>
        <p className="mt-4 max-w-[48ch] text-body text-ink-muted">
          {preview
            ? "Explore our services and try the quotation form preview. Contact details and online submissions will be enabled once confirmed."
            : "Prefer a conversation? Contact us directly, or send the quotation form and we will reply."}
        </p>
      </div>

      <ContactChannels layout="stack" />

      {(address || hours) && (
        <dl className="flex flex-col gap-6">
          {address && (
            <div className="flex gap-4">
              <dt className="shrink-0">
                <IconTile icon={MapPin} />
                <span className="sr-only">Office</span>
              </dt>
              <dd className="flex flex-col items-start gap-1">
                <span aria-hidden className="type-label pt-1 text-ink-subtle">
                  Office
                </span>
                <address className="text-body whitespace-pre-line text-ink not-italic">{address}</address>
                {mapsUrl && isWebUrl(mapsUrl) && (
                  <LinkButton href={mapsUrl} external variant="link" size="sm" className="min-h-11">
                    Open in Google Maps
                  </LinkButton>
                )}
              </dd>
            </div>
          )}
          {hours && (
            <div className="flex gap-4">
              <dt className="shrink-0">
                <IconTile icon={Clock} />
                <span className="sr-only">Office hours</span>
              </dt>
              <dd className="flex flex-col gap-1">
                <span aria-hidden className="type-label pt-1 text-ink-subtle">
                  Office hours
                </span>
                <span className="text-body whitespace-pre-line text-ink">{hours}</span>
              </dd>
            </div>
          )}
        </dl>
      )}

      {/* TEMPORARY sample details (site.demoContact): plain text, never links; gone once real details exist. */}
      {demoContactItems.length > 0 && (
        <div>
          <Badge>Sample details</Badge>
          <p className="mt-4 max-w-[48ch] text-body-sm text-ink-subtle">
            Temporary details for preview only. FMECC&rsquo;s confirmed contact information will replace them.
          </p>
          <dl className="mt-6 flex flex-col gap-6">
            {demoContactItems.map((item) => (
              <div key={item.kind} className="flex gap-4">
                <dt className="shrink-0">
                  <IconTile icon={demoIcons[item.kind]} />
                  <span className="sr-only">{item.label}</span>
                </dt>
                <dd className="flex flex-col gap-1">
                  <span aria-hidden className="type-label pt-1 text-ink-subtle">
                    {item.label}
                  </span>
                  <span className="text-body whitespace-pre-line text-ink">{item.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Shown until FMECC supplies contact details in src/shared/config/site.ts. */}
      {!hasDetails && demoContactItems.length === 0 && (
        <p className="border-y border-line py-5 text-body-sm text-ink-subtle">
          Direct phone, email and office details will be listed here once confirmed. In the meantime, please use the
          quotation form.
        </p>
      )}

      <div className="rounded-md bg-surface-muted p-6 lg:p-8">
        <h3 className="font-display text-heading-sm font-semibold">What happens next</h3>
        <ol className="mt-6 flex flex-col gap-5">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span aria-hidden className="type-label pt-1 text-highlight tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-medium text-ink">{step.title}</span>
                <span className="text-body-sm text-ink-muted">{step.description}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
